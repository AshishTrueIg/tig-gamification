import { PlayerEventProcessor } from '@src/services/events/playerEventProcessor.service'
import { ApiHelper } from '@src/utils/api.utils'
import { Logger } from '@src/libs/logger'

export class PlayerEventsController {
  
  // Process a single gaming event
  static async processEvent(req, res, next) {
    try {
      const eventData = {
        ...req.body,
        deviceInfo: req.body.deviceInfo || {
          userAgent: req.get('User-Agent'),
          ip: req.ip
        },
        ipAddress: req.ip,
        countryCode: req.body.countryCode || 'US'
      }

      const processor = new PlayerEventProcessor()
      const result = await processor.processEvent(eventData)
      
      ApiHelper.sendResponse({ req, res, next }, {
        success: true,
        eventId: result.eventId,
        message: 'Event processed successfully'
      })
    } catch (error) {
      Logger.error('Error processing event', {
        error: error.message,
        body: req.body
      })
      next(error)
    }
  }

  // Process multiple events in batch
  static async processBatchEvents(req, res, next) {
    try {
      const { events } = req.body
      const processor = new PlayerEventProcessor()
      const results = []

      for (const eventData of events) {
        try {
          const result = await processor.processEvent({
            ...eventData,
            deviceInfo: eventData.deviceInfo || {
              userAgent: req.get('User-Agent'),
              ip: req.ip
            },
            ipAddress: req.ip
          })
          results.push({
            success: true,
            eventId: result.eventId,
            originalEvent: eventData
          })
        } catch (error) {
          results.push({
            success: false,
            error: error.message,
            originalEvent: eventData
          })
        }
      }

      ApiHelper.sendResponse({ req, res, next }, {
        success: true,
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      })
    } catch (error) {
      next(error)
    }
  }

  // Get player events for analytics
  static async getPlayerEvents(req, res, next) {
    try {
      const { userId, eventType, startDate, endDate, limit = 100, offset = 0 } = req.query
      
      const where = {}
      if (userId) where.userId = userId
      if (eventType) where.eventType = eventType
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt[Op.gte] = new Date(startDate)
        if (endDate) where.createdAt[Op.lte] = new Date(endDate)
      }

      const events = await db.PlayerEvent.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['user_id', 'username', 'email']
        }]
      })

      ApiHelper.sendResponse({ req, res, next }, {
        events: events.rows,
        total: events.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      })
    } catch (error) {
      next(error)
    }
  }

  // Get player statistics
  static async getPlayerStatistics(req, res, next) {
    try {
      const { userId } = req.params

      const stats = await db.PlayerStatistic.findOne({
        where: { userId },
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: db.UserDetail,
            as: 'userDetail',
            include: [{
              model: db.VipTier,
              as: 'vipTier'
            }]
          }]
        }]
      })

      if (!stats) {
        return ApiHelper.sendResponse({ req, res, next }, {
          error: 'Player statistics not found'
        }, 404)
      }

      ApiHelper.sendResponse({ req, res, next }, { stats })
    } catch (error) {
      next(error)
    }
  }

  // Get real-time player metrics for dashboard
  static async getRealtimeMetrics(req, res, next) {
    try {
      const { timeframe = '24h' } = req.query
      
      let startDate
      switch (timeframe) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000)
          break
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      }

      const metrics = await db.PlayerEvent.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        },
        attributes: [
          'eventType',
          [db.sequelize.fn('COUNT', '*'), 'count'],
          [db.sequelize.fn('SUM', 
            db.sequelize.literal('CASE WHEN amount IS NOT NULL THEN amount ELSE 0 END')
          ), 'totalAmount']
        ],
        group: ['eventType'],
        raw: true
      })

      const activeUsers = await db.PlayerEvent.count({
        distinct: true,
        col: 'userId',
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      })

      ApiHelper.sendResponse({ req, res, next }, {
        timeframe,
        activeUsers,
        eventMetrics: metrics
      })
    } catch (error) {
      next(error)
    }
  }
}