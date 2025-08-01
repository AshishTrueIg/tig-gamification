import db from '@src/db/models'
import { crmQueue } from '@src/queues/crm.queue'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/baseHandler'

export class PlayerEventProcessor extends BaseHandler {
  async processEvent(eventData) {
    try {
      // 1. Store the raw event
      const playerEvent = await this.storePlayerEvent(eventData)
      
      // 2. Update player statistics
      await this.updatePlayerStatistics(eventData)
      
      // 3. Update session if applicable
      if (eventData.sessionId) {
        await this.updatePlayerSession(eventData)
      }
      
      // 4. Check VIP tier progression
      await this.checkVipTierProgression(eventData.userId)
      
      // 5. Trigger automation rules
      await this.triggerAutomationRules(eventData)
      
      // 6. Update segment memberships
      await this.updateSegmentMemberships(eventData.userId)
      
      Logger.info('Player event processed successfully', {
        eventId: playerEvent.eventId,
        userId: eventData.userId,
        eventType: eventData.eventType
      })
      
      return playerEvent
    } catch (error) {
      Logger.error('Error processing player event', {
        error: error.message,
        eventData
      })
      throw error
    }
  }

  async storePlayerEvent(eventData) {
    return await db.PlayerEvent.create({
      userId: eventData.userId,
      eventType: eventData.eventType,
      eventData: eventData.data || {},
      sessionId: eventData.sessionId,
      gameId: eventData.gameId,
      amount: eventData.amount,
      currency: eventData.currency || 'USD',
      deviceInfo: eventData.deviceInfo,
      ipAddress: eventData.ipAddress,
      countryCode: eventData.countryCode
    })
  }

  async updatePlayerStatistics(eventData) {
    const { userId, eventType, amount = 0, data = {} } = eventData
    
    // Get or create player statistics
    let [stats] = await db.PlayerStatistic.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        daysSignceSignup: this.calculateDaysSinceSignup(userId)
      }
    })

    // Update based on event type
    switch (eventType) {
      case 'login':
        await this.updateLoginStats(stats, eventData)
        break
      case 'deposit':
        await this.updateDepositStats(stats, amount)
        break
      case 'withdrawal':
        await this.updateWithdrawalStats(stats, amount)
        break
      case 'bet':
        await this.updateBettingStats(stats, amount, data)
        break
      case 'win':
        await this.updateWinStats(stats, amount, data)
        break
      case 'refer':
        await this.updateReferralStats(stats)
        break
      case 'bonus_claimed':
        await this.updateBonusStats(stats, amount)
        break
      case 'vip_tier_upgrade':
        await this.updateVipStats(stats, data)
        break
    }

    // Calculate risk scores
    stats.churnRiskScore = await this.calculateChurnRisk(stats)
    stats.spendingPropensity = await this.calculateSpendingPropensity(stats)
    stats.lastCalculatedAt = new Date()
    
    await stats.save()
  }

  async updateLoginStats(stats, eventData) {
    const now = new Date()
    const lastLogin = new Date(stats.updatedAt)
    const hoursSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60)
    
    // Update login streak
    if (hoursSinceLastLogin <= 48) { // Within 2 days
      stats.loginStreakCurrent += 1
      if (stats.loginStreakCurrent > stats.loginStreakLongest) {
        stats.loginStreakLongest = stats.loginStreakCurrent
      }
    } else {
      stats.loginStreakCurrent = 1
    }
    
    stats.daysSinceLastLogin = 0
  }

  async updateDepositStats(stats, amount) {
    stats.totalDeposited = parseFloat(stats.totalDeposited) + parseFloat(amount)
    stats.daysSinceLastDeposit = 0
    
    // Update spending propensity
    if (amount > 100) {
      stats.spendingPropensity = 'high'
    } else if (amount > 50) {
      stats.spendingPropensity = 'medium'
    }
  }

  async updateBettingStats(stats, amount, data) {
    stats.totalWagered = parseFloat(stats.totalWagered) + parseFloat(amount)
    stats.totalBets += 1
    stats.daysSinceLastBet = 0
    
    // Update favorite games
    if (data.gameId) {
      const favoriteGames = stats.favoriteGames || {}
      favoriteGames[data.gameId] = (favoriteGames[data.gameId] || 0) + 1
      stats.favoriteGames = favoriteGames
    }
  }

  async updateWinStats(stats, amount, data) {
    stats.totalWon = parseFloat(stats.totalWon) + parseFloat(amount)
    stats.totalWins += 1
    
    if (amount > stats.largestWin) {
      stats.largestWin = amount
    }
    
    // Calculate net result
    stats.netResult = parseFloat(stats.totalWon) - parseFloat(stats.totalWagered)
  }

  async triggerAutomationRules(eventData) {
    // Find matching automation rules
    const rules = await db.CampaignAutomationRule.findAll({
      where: {
        triggerEvent: eventData.eventType,
        isActive: true
      },
      include: [{
        model: db.Campaign,
        where: { isActive: true }
      }],
      order: [['priority', 'ASC']]
    })

    for (const rule of rules) {
      await this.evaluateAutomationRule(rule, eventData)
    }
  }

  async evaluateAutomationRule(rule, eventData) {
    try {
      // Check conditions
      const conditionsMet = await this.evaluateConditions(rule.conditions, eventData)
      if (!conditionsMet) return

      // Check cooldown
      const isInCooldown = await this.checkCooldown(rule, eventData.userId)
      if (isInCooldown) return

      // Check execution limits
      const canExecute = await this.checkExecutionLimits(rule, eventData.userId)
      if (!canExecute) return

      // Queue the campaign execution
      await crmQueue.add('execute-automated-campaign', {
        ruleId: rule.ruleId,
        campaignId: rule.campaignId,
        userId: eventData.userId,
        eventData,
        delayHours: rule.delayHours
      }, {
        delay: rule.delayHours * 60 * 60 * 1000 // Convert hours to milliseconds
      })

      Logger.info('Automation rule triggered', {
        ruleId: rule.ruleId,
        userId: eventData.userId,
        eventType: eventData.eventType
      })
    } catch (error) {
      Logger.error('Error evaluating automation rule', {
        ruleId: rule.ruleId,
        error: error.message
      })
    }
  }

  async evaluateConditions(conditions, eventData) {
    // Simple condition evaluation - can be extended
    for (const condition of conditions) {
      switch (condition.type) {
        case 'amount_greater_than':
          if (!eventData.amount || parseFloat(eventData.amount) <= condition.value) {
            return false
          }
          break
        case 'amount_less_than':
          if (!eventData.amount || parseFloat(eventData.amount) >= condition.value) {
            return false
          }
          break
        case 'first_time_event':
          const existingEvents = await db.PlayerEvent.count({
            where: {
              userId: eventData.userId,
              eventType: eventData.eventType
            }
          })
          if (existingEvents > 1) return false
          break
        case 'vip_tier':
          const userDetails = await db.UserDetail.findOne({
            where: { userId: eventData.userId }
          })
          if (!userDetails || !condition.vipTiers.includes(userDetails.vipTierId)) {
            return false
          }
          break
      }
    }
    return true
  }

  async checkCooldown(rule, userId) {
    const lastExecution = await db.CampaignExecution.findOne({
      where: {
        ruleId: rule.ruleId,
        userId
      },
      order: [['createdAt', 'DESC']]
    })

    if (!lastExecution) return false

    const hoursSinceLastExecution = (Date.now() - lastExecution.createdAt) / (1000 * 60 * 60)
    return hoursSinceLastExecution < rule.cooldownHours
  }

  async updateSegmentMemberships(userId) {
    // Queue segment recalculation for this user
    await crmQueue.add('recalculate-user-segments', {
      userId
    })
  }

  async calculateChurnRisk(stats) {
    let risk = 0
    
    // Days since last login
    if (stats.daysSinceLastLogin > 14) risk += 40
    else if (stats.daysSinceLastLogin > 7) risk += 20
    else if (stats.daysSinceLastLogin > 3) risk += 10
    
    // Betting activity
    if (stats.daysSinceLastBet > 14) risk += 30
    else if (stats.daysSinceLastBet > 7) risk += 15
    
    // Session frequency
    if (stats.totalSessions < 5) risk += 20
    
    // Deposit activity
    if (stats.totalDeposited < 50) risk += 10
    
    return Math.min(risk, 100)
  }

  async calculateSpendingPropensity(stats) {
    const avgDeposit = stats.totalDeposited / Math.max(1, stats.daysSinceSignup)
    
    if (avgDeposit > 10) return 'high'
    if (avgDeposit > 2) return 'medium'
    return 'low'
  }
}