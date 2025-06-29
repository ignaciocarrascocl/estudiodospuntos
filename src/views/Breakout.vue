<template>
  <div class="breakout-section">
    <div class="game-container">
      <div ref="pixiContainer" class="pixi-container"></div>
      <div v-if="gameOver" class="game-over">
        <h2>{{ gameWon ? '¡Ganaste!' : 'Game Over' }}</h2>
        <p>Puntuación: {{ score }}</p>
        <button @click="restartGame" class="restart-btn">Jugar de nuevo</button>
      </div>
      <div v-if="gameStarted && !gameOver" class="score">
        Puntuación: {{ score }} | Nivel: {{ level }}
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import * as PIXI from 'pixi.js'

export default {
  name: 'BreakoutView',  setup() {
    const pixiContainer = ref(null)
    const gameStarted = ref(false)
    const gameOver = ref(false)
    const gameWon = ref(false)
    const score = ref(0)

    let app = null
    let paddle = null
    let balls = [] // Changed to array for multiple balls
    let bricks = []
    let powerUps = []
    let mouseX = 0
    let gameInitialized = false
    let level = 1
    let baseSpeed = 3
    let lastPowerUpTime = 0

    // Site colors from theme constants
    const siteColors = {
      blue: 0x3030D0,
      pink: 0xFF97D6,
      green: 0x00DEB5,
      orange: 0xFF4B00,
      white: 0xFFFFFF,
      black: 0x000000
    }

    // Responsive game dimensions
    const getGameDimensions = () => {
      const isMobile = window.innerWidth <= 768
      return {
        GAME_WIDTH: isMobile ? 350 : 800,
        GAME_HEIGHT: isMobile ? 500 : 600,
        PADDLE_WIDTH: isMobile ? 70 : 100,
        PADDLE_HEIGHT: 15,
        BALL_SIZE: 8,
        BRICK_WIDTH: isMobile ? 40 : 75,
        BRICK_HEIGHT: isMobile ? 20 : 25,
        BRICK_ROWS: 5,
        BRICK_COLS: isMobile ? 7 : 10
      }
    }

    let dimensions = getGameDimensions()

    const initPixi = async () => {
      dimensions = getGameDimensions() // Update dimensions on init

      app = new PIXI.Application()

      await app.init({
        width: dimensions.GAME_WIDTH,
        height: dimensions.GAME_HEIGHT,
        backgroundColor: siteColors.black,
        antialias: true
      })

      if (pixiContainer.value) {
        pixiContainer.value.appendChild(app.canvas)
      }

      // Initialize game immediately
      initializeGame()
    }

    const initializeGame = () => {
      if (gameInitialized) return
      gameInitialized = true

      createPaddle()
      createBall()
      createBricks()
    }

    const onPaddleClick = () => {
      if (!gameStarted.value) {
        startGame()
      }
    }

    const createPaddle = () => {
      paddle = new PIXI.Graphics()
      paddle.beginFill(siteColors.white)
      paddle.drawRoundedRect(0, 0, dimensions.PADDLE_WIDTH, dimensions.PADDLE_HEIGHT, 8)
      paddle.endFill()
      paddle.x = dimensions.GAME_WIDTH / 2 - dimensions.PADDLE_WIDTH / 2
      paddle.y = dimensions.GAME_HEIGHT - 50
      paddle.interactive = true
      paddle.buttonMode = true
      paddle.on('pointerdown', onPaddleClick)
      app.stage.addChild(paddle)
    }

    const createBall = (x = null, y = null, vx = null, vy = null) => {
      const ball = new PIXI.Graphics()
      ball.beginFill(siteColors.pink)
      ball.drawCircle(0, 0, dimensions.BALL_SIZE)
      ball.endFill()
      ball.x = x || dimensions.GAME_WIDTH / 2
      ball.y = y || dimensions.GAME_HEIGHT / 2
      ball.velocity = {
        x: vx || 0,
        y: vy || 0
      }
      app.stage.addChild(ball)
      balls.push(ball)
      return ball
    }

    const createPowerUp = (x, y, type) => {
      const powerUp = new PIXI.Graphics()
      const colors = {
        'multiBall': siteColors.orange,
        'speedUp': siteColors.green,
        'bigPaddle': siteColors.blue,
        'slowDown': siteColors.white
      }

      powerUp.beginFill(colors[type] || siteColors.orange)
      powerUp.drawCircle(0, 0, 8)
      powerUp.endFill()
      powerUp.x = x
      powerUp.y = y
      powerUp.type = type
      powerUp.velocity = { x: 0, y: 2 }

      app.stage.addChild(powerUp)
      powerUps.push(powerUp)
    }

    const activatePowerUp = (type) => {
      switch (type) {
        case 'multiBall':
          // Create 2 additional balls
          for (let i = 0; i < 2; i++) {
            createBall(
              balls[0].x + (Math.random() - 0.5) * 50,
              balls[0].y,
              (Math.random() - 0.5) * baseSpeed * 2,
              -baseSpeed
            )
          }
          break

        case 'speedUp':
          // Increase ball speed temporarily
          balls.forEach(ball => {
            ball.velocity.x *= 1.5
            ball.velocity.y *= 1.5
          })
          break

        case 'bigPaddle': {
          // Make paddle bigger temporarily
          const originalWidth = dimensions.PADDLE_WIDTH
          dimensions.PADDLE_WIDTH *= 1.5
          paddle.clear()
          paddle.beginFill(siteColors.white)
          paddle.drawRoundedRect(0, 0, dimensions.PADDLE_WIDTH, dimensions.PADDLE_HEIGHT, 8)
          paddle.endFill()

          setTimeout(() => {
            dimensions.PADDLE_WIDTH = originalWidth
            paddle.clear()
            paddle.beginFill(siteColors.white)
            paddle.drawRoundedRect(0, 0, dimensions.PADDLE_WIDTH, dimensions.PADDLE_HEIGHT, 8)
            paddle.endFill()
          }, 10000)
          break
        }

        case 'slowDown':
          // Slow down balls temporarily
          balls.forEach(ball => {
            ball.velocity.x *= 0.7
            ball.velocity.y *= 0.7
          })
          break
      }
    }

    const nextLevel = () => {
      // Reset bricks visibility for next level
      bricks.forEach(brick => brick.visible = true)

      // Add speed to existing balls
      balls.forEach(ball => {
        const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2)
        const newSpeed = speed + 0.5
        const angle = Math.atan2(ball.velocity.y, ball.velocity.x)
        ball.velocity.x = Math.cos(angle) * newSpeed
        ball.velocity.y = Math.sin(angle) * newSpeed
      })
    }

    const createBricks = () => {
      bricks = []
      const colors = [siteColors.blue, siteColors.green, siteColors.orange, siteColors.pink, siteColors.white]

      for (let row = 0; row < dimensions.BRICK_ROWS; row++) {
        for (let col = 0; col < dimensions.BRICK_COLS; col++) {
          const brick = new PIXI.Graphics()
          brick.beginFill(colors[row])
          brick.drawRoundedRect(0, 0, dimensions.BRICK_WIDTH, dimensions.BRICK_HEIGHT, 4)
          brick.endFill()

          brick.x = col * (dimensions.BRICK_WIDTH + 5) + 35
          brick.y = row * (dimensions.BRICK_HEIGHT + 5) + 80
          brick.visible = true

          app.stage.addChild(brick)
          bricks.push(brick)
        }
      }
    }

    const startGame = () => {
      gameStarted.value = true
      gameOver.value = false
      gameWon.value = false
      score.value = 0

      // Clear existing balls
      balls.forEach(ball => app.stage.removeChild(ball))
      balls = []

      // Create initial ball
      const initialBall = createBall()
      initialBall.velocity = { x: baseSpeed, y: -baseSpeed }

      app.ticker.add(gameLoop)
    }

    const restartGame = () => {
      app.ticker.remove(gameLoop)

      // Reset game state
      level = 1
      baseSpeed = 3

      // Clear all balls and power-ups
      balls.forEach(ball => app.stage.removeChild(ball))
      powerUps.forEach(powerUp => app.stage.removeChild(powerUp))
      balls = []
      powerUps = []

      // Reset paddle size
      dimensions = getGameDimensions()
      paddle.clear()
      paddle.beginFill(siteColors.white)
      paddle.drawRoundedRect(0, 0, dimensions.PADDLE_WIDTH, dimensions.PADDLE_HEIGHT, 8)
      paddle.endFill()

      startGame()
    }

    const gameLoop = () => {
      // Move and update all balls
      balls.forEach((ball, ballIndex) => {
        ball.x += ball.velocity.x
        ball.y += ball.velocity.y

        // Ball collision with walls
        if (ball.x <= dimensions.BALL_SIZE || ball.x >= dimensions.GAME_WIDTH - dimensions.BALL_SIZE) {
          ball.velocity.x = -ball.velocity.x
        }
        if (ball.y <= dimensions.BALL_SIZE) {
          ball.velocity.y = -ball.velocity.y
        }

        // Ball collision with paddle
        if (ball.y + dimensions.BALL_SIZE >= paddle.y &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + dimensions.PADDLE_WIDTH &&
            ball.velocity.y > 0) {
          ball.velocity.y = -ball.velocity.y

          // Add some spin based on where ball hits paddle
          const hitPos = (ball.x - paddle.x) / dimensions.PADDLE_WIDTH
          ball.velocity.x = (hitPos - 0.5) * 6
        }

        // Ball collision with bricks
        bricks.forEach((brick) => {
          if (brick.visible &&
              ball.x + dimensions.BALL_SIZE >= brick.x &&
              ball.x - dimensions.BALL_SIZE <= brick.x + dimensions.BRICK_WIDTH &&
              ball.y + dimensions.BALL_SIZE >= brick.y &&
              ball.y - dimensions.BALL_SIZE <= brick.y + dimensions.BRICK_HEIGHT) {

            brick.visible = false
            ball.velocity.y = -ball.velocity.y
            score.value += 10

            // Random power-up chance (15%)
            if (Math.random() < 0.15 && Date.now() - lastPowerUpTime > 3000) {
              const powerUpTypes = ['multiBall', 'speedUp', 'bigPaddle', 'slowDown']
              const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
              createPowerUp(brick.x + dimensions.BRICK_WIDTH / 2, brick.y + dimensions.BRICK_HEIGHT, randomType)
              lastPowerUpTime = Date.now()
            }

            // Check win condition
            const visibleBricks = bricks.filter(b => b.visible)
            if (visibleBricks.length === 0) {
              level++
              baseSpeed += 0.5 // Increase speed each level
              nextLevel()
            }
          }
        })

        // Remove balls that go off screen
        if (ball.y > dimensions.GAME_HEIGHT) {
          app.stage.removeChild(ball)
          balls.splice(ballIndex, 1)
        }
      })

      // Move power-ups
      powerUps.forEach((powerUp, index) => {
        powerUp.y += powerUp.velocity.y

        // Power-up collision with paddle
        if (powerUp.y + 8 >= paddle.y &&
            powerUp.x >= paddle.x &&
            powerUp.x <= paddle.x + dimensions.PADDLE_WIDTH) {

          activatePowerUp(powerUp.type)
          app.stage.removeChild(powerUp)
          powerUps.splice(index, 1)
        }

        // Remove power-ups that go off screen
        if (powerUp.y > dimensions.GAME_HEIGHT) {
          app.stage.removeChild(powerUp)
          powerUps.splice(index, 1)
        }
      })

      // Game over condition - no balls left
      if (balls.length === 0) {
        gameOver.value = true
        app.ticker.remove(gameLoop)
      }

      // Move paddle with mouse
      if (mouseX > 0 && mouseX < dimensions.GAME_WIDTH) {
        paddle.x = Math.max(0, Math.min(dimensions.GAME_WIDTH - dimensions.PADDLE_WIDTH, mouseX - dimensions.PADDLE_WIDTH / 2))
      }
    }

    const handleMouseMove = (e) => {
      if (pixiContainer.value) {
        const rect = pixiContainer.value.getBoundingClientRect()
        mouseX = e.clientX - rect.left
      }
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      if (pixiContainer.value && e.touches.length > 0) {
        const rect = pixiContainer.value.getBoundingClientRect()
        mouseX = e.touches[0].clientX - rect.left
      }
    }

    onMounted(() => {
      initPixi()

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove)
    })

    onUnmounted(() => {
      if (app) {
        app.ticker.remove(gameLoop)
        app.destroy(true)
      }

      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    })

    return {
      pixiContainer,
      gameStarted,
      gameOver,
      gameWon,
      score,
      level: computed(() => level),
      startGame,
      restartGame
    }
  }
}
</script>

<style scoped>
.breakout-section {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  color: #FFFFFF;
  position: relative;
}

.game-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pixi-container {
  border: 2px solid #3030D0;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(48, 48, 208, 0.3);
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(0, 0, 0, 0.95);
  padding: 3rem 2rem;
  border-radius: 20px;
  backdrop-filter: blur(15px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  z-index: 10;
  min-width: 300px;
}

.game-over h2 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #FF97D6;
  font-weight: 300;
  letter-spacing: 2px;
}

.game-over p {
  font-size: 1.4rem;
  margin-bottom: 2rem;
  color: #FFFFFF;
  opacity: 0.9;
  font-weight: 300;
}

.restart-btn {
  background: linear-gradient(135deg, #3030D0, #FF97D6);
  border: none;
  color: #FFFFFF;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 10px 30px rgba(48, 48, 208, 0.3);
}

.restart-btn:hover {
  background: linear-gradient(135deg, #FF97D6, #00DEB5);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 151, 214, 0.4);
}

.score {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #00DEB5;
  z-index: 5;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .pixi-container {
    border-width: 1px;
  }

  .game-over {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
    min-width: 280px;
  }

  .game-over h2 {
    font-size: 2.5rem;
  }

  .game-over p {
    font-size: 1.1rem;
  }

  .score {
    font-size: 1.2rem;
    top: 15px;
    left: 15px;
  }

  .restart-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
