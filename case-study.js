 const canvas = document.querySelector('canvas')
 const c = canvas.getContext('2d')
 canvas.width = innerWidth
 canvas.height = innerHeight
 const scoreID = document.querySelector('#scoreID')
 const statGameID = document.querySelector('#startGameID')

 class Player {
    constructor(x,y,radius,color) {
        this.x = x
        this.y = y;
        this.radius = radius
        this.color = color
    }
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
     }
   }
 class Projectile {
    constructor(x,y,radius,color,velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
     draw(){
         c.beginPath()
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
         c.fillStyle = this.color
         c.fill()
     }
     update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
     }
 }
 class Enemy {
     constructor(x,y,radius,color,velocity) {
         this.x = x
         this.y = y
         this.radius = radius
         this.color = color
         this.velocity = velocity
     }
     draw(){
         c.beginPath()
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
         c.fillStyle = this.color
         c.fill()
     }
     update(){
         this.draw()
         this.x = this.x + this.velocity.x
         this.y = this.y + this.velocity.y
     }

 }
 const x = canvas.width/2
 const y = canvas.height/2
 const player = new Player(x,y,10,'white')
 let projectiles = []
 let enemies = []

 function spawnEnemy() {
     setInterval(()=>{
         const radius = Math.random() * 25 + 5
         let x
         let y
         if (Math.random() < 1/2){
             x = Math.random() < 1/2? - radius : canvas.width + radius
             y = Math.random() * canvas.height
         }else {
             x = Math.random() * canvas.width
             y = Math.random() < 1/2? - radius : canvas.height + radius
         }
         const color = `hsl(${Math.random() * 360}, 100%,50%)`
         const angle = Math.atan2(
             canvas.height/2 - y,
             canvas.width/2 - x
         )
         const velocity = {
             x: Math.cos(angle) * 3,
             y: Math.sin(angle) * 3
         }
         enemies.push(new Enemy(x,y,radius,color,velocity))
     },1000)
 }
 let animateID
 let score = 0
 function animate(){
    animateID = requestAnimationFrame(animate)
     c.fillStyle = 'rgba(0,0,0,0.09)'
     c.fillRect(0 , 0, canvas.width,canvas.height)
     player.draw()
     projectiles.forEach((projectile,index) =>
     {
       projectile.update()
         if (projectile.x - projectile.radius < 0){
             setTimeout(() => {projectiles.splice(index,1)},0)
         }
     });
    enemies.forEach((enemy,enemyIndex) => {
        enemy.update()
        // endgame
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - player.radius - enemy.radius < 1) {
            cancelAnimationFrame(animateID)
        }
        // enemies and projectiles
        projectiles.forEach((projectile,projectilesIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
           if (dist - projectile.radius - enemy.radius < 1){
               // add score
               if (enemy.radius -5 > 10){
                   score += 100
                   scoreID.innerHTML = score
                   enemy.radius -= 5
                   setTimeout(() => {
                       projectiles.splice(projectilesIndex,1)},0)}
              else {
                   score += 200
                   scoreID.innerHTML = score
                setTimeout(() => {
                    enemies.splice(enemyIndex,1,)
                    projectiles.splice(projectilesIndex,1)},0)
            } }
        });
    })
 }

 addEventListener("click",(event)=> {
     const angle = Math.atan2
        (event.clientY-canvas.height/2,
         event.clientX-canvas.width/2)

     const velocity = {
         x: Math.cos(angle) * 5,
         y: Math.sin(angle) * 5
     }
         projectiles.push(
             new Projectile(canvas.width/2,canvas.height/2,5,
             'white',
                 velocity)
         )
 })
 statGameID.addEventListener("click",() => {
     animate()
     spawnEnemy()
 })
