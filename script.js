document.addEventListener('DOMContentLoaded', function() {
    const surpriseBoxContainer = document.getElementById('surprise-box-container');
    const surpriseBox = document.getElementById('surprise-box');
    const mainContainer = document.getElementById('main-container');
    const momGreeting = document.getElementById('mom-greeting');
    const festivalGreeting = document.getElementById('festival-greeting');
    const interactiveMessages = document.querySelectorAll('.interactive-message');
    const easterEggTrigger = document.getElementById('easter-egg-trigger');
    const easterEggMessage = document.getElementById('easter-egg-message');
    const galleryImages = document.querySelectorAll('.gallery-image');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close-modal');

    // --- 惊喜礼盒交互 ---
    surpriseBoxContainer.addEventListener('click', openSurpriseBox);

    function openSurpriseBox() {
        surpriseBox.classList.add('opened');
        triggerConfettiBurst(); // 触发撒花

        // 盖子动画完成后显示主内容
        setTimeout(() => {
            surpriseBoxContainer.style.transition = 'opacity 0.5s ease-out';
            surpriseBoxContainer.style.opacity = '0';
            setTimeout(() => {
                surpriseBoxContainer.style.display = 'none';
                mainContainer.style.display = 'block';
                mainContainer.style.opacity = '1'; // 确保在fadeInScaleUp动画开始前是1
                typeGreeting("亲爱的妈妈：", momGreeting, 100, () => {
                    typeGreeting("母亲节超级快乐！", festivalGreeting, 100);
                });
                startParticleAnimation(); // 开启背景粒子效果
            }, 500); // 等待透明度动画完成
        }, 800); // 对应盖子动画时长
    }

    // --- 打字机效果 ---
    function typeGreeting(text, element, speed, callback) {
        let i = 0;
        element.innerHTML = ''; // 清空
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else if (callback) {
                callback();
            }
        }
        typing();
    }

    // --- 互动祝福语 ---
    interactiveMessages.forEach(msg => {
        msg.addEventListener('click', function() {
            if (!this.classList.contains('revealed')) {
                this.textContent = this.dataset.message;
                this.classList.add('revealed');
                triggerConfettiShower(); // 每次点击也来点小撒花
            }
        });
    });

    // --- 彩蛋 ---
    easterEggTrigger.addEventListener('click', () => {
        easterEggMessage.style.display = easterEggMessage.style.display === 'none' ? 'block': 'none';
        if (easterEggMessage.style.display === 'block') {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: {
                    y: 0.8, x: 0.5
                }, // 从下方中间喷射
                colors: ['#FFC0CB', '#FF69B4', '#FFD700']
            });
        }
    });

    // --- 图片画廊与模态框 ---
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            modal.style.display = "block";
            modalImage.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    closeModal.addEventListener('click',
        function() {
            modal.style.display = "none";
        });

    window.addEventListener('click',
        function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

    // --- 撒花/礼花效果 (使用 canvas-confetti) ---
    function triggerConfettiBurst() {
        // 礼盒打开时的盛大喷射
        confetti({
            particleCount: 200,
            spread: 120,
            origin: {
                y: 0.6
            },
            // 从屏幕中间稍微偏下一点喷射
            colors: ['#ff80ab',
                '#fce4ec',
                '#f48fb1',
                '#c2185b',
                '#FFD700'],
            // 母亲节主题色
            shapes: ['square',
                'circle',
                'star'],
            zIndex: 1002 //确保在礼盒之上，主内容之下
        });

        // 多点喷射，营造更饱满效果
        setTimeout(() => confetti({
            particleCount: 100, angle: 60, spread: 80, origin: {
                x: 0
            }, colors: ['#FFC0CB', '#FF69B4']
        }),
            200);
        setTimeout(() => confetti({
            particleCount: 100, angle: 120, spread: 80, origin: {
                x: 1
            }, colors: ['#FFC0CB', '#FF69B4']
        }),
            200);
    }

    function triggerConfettiShower() {
        // 点击祝福语时的小范围撒花
        confetti({
            particleCount: 80,
            spread: 90,
            origin: {
                y: Math.random() * 0.3 + 0.3,
                x: Math.random()
            },
            // 在消息附近随机喷射
            colors: ['#f8bbd0',
                '#ffe4e1',
                '#FFD700'],
            scalar: 0.8 // 花纸大小
        });
    }

    // --- 背景粒子/花瓣动画 (Canvas) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = 50; // 粒子数量
        canvas.width = mainContainer.offsetWidth; // 根据主容器宽度设置，确保在容器内
        canvas.height = mainContainer.offsetHeight; // 根据主容器高度设置

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 5 + 2; // 粒子大小
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let directionX = (Math.random() * 0.4) - 0.2; // 水平移动速度
            let directionY = (Math.random() * 0.4) - 0.2; // 垂直移动速度
            let color = ['#fce4ec',
                '#f8bbd0',
                '#ffc0cb',
                'rgba(255, 215, 0, 0.6)'][Math.floor(Math.random() * 4)]; // 粒子颜色 (包含淡金色)

            particlesArray.push({
                x, y, directionX, directionY, size, color
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            let particle = particlesArray[i];
            particle.x += particle.directionX;
            particle.y += particle.directionY;

            // 边缘检测，让粒子循环
            if (particle.x > canvas.width + particle.size || particle.x < -particle.size) particle.x = Math.random() * canvas.width;
            if (particle.y > canvas.height + particle.size || particle.y < -particle.size) particle.y = Math.random() * canvas.height;


            // 画出爱心形状的粒子 (更复杂，可选)
            /*
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y + particle.size / 4);
            ctx.bezierCurveTo(particle.x, particle.y, particle.x - particle.size / 2, particle.y, particle.x - particle.size / 2, particle.y + particle.size / 4);
            ctx.bezierCurveTo(particle.x - particle.size / 2, particle.y + particle.size / 2, particle.x, particle.y + particle.size * 3 / 4, particle.x, particle.y + particle.size);
            ctx.bezierCurveTo(particle.x, particle.y + particle.size * 3 / 4, particle.x + particle.size / 2, particle.y + particle.size / 2, particle.x + particle.size / 2, particle.y + particle.size / 4);
            ctx.bezierCurveTo(particle.x + particle.size / 2, particle.y, particle.x, particle.y, particle.x, particle.y + particle.size / 4);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
            */

            // 简单的圆形粒子
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particle.color;
            ctx.fill();

        }
        requestAnimationFrame(animateParticles);
    }

    function startParticleAnimation() {
        // 确保在主容器可见且有尺寸后再初始化和启动
        if (mainContainer.offsetWidth > 0 && mainContainer.offsetHeight > 0) {
            initParticles();
            animateParticles();
        } else {
            // 如果容器还未完全渲染，稍后重试
            setTimeout(startParticleAnimation, 100);
        }
    }

    // 窗口大小改变时重新初始化粒子，以适应新的画布尺寸
    window.addEventListener('resize', () => {
        if (mainContainer.style.display === 'block') {
            // canvas.width = mainContainer.offsetWidth;
            // canvas.height = mainContainer.offsetHeight;
            // initParticles(); // 简单的做法是重新初始化，也可以尝试动态调整现有粒子
            // 更好的做法是节流或防抖
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function() {
                if (mainContainer.style.display === 'block') {
                    //再次检查
                    canvas.width = mainContainer.offsetWidth;
                    canvas.height = mainContainer.offsetHeight;
                    initParticles();
                }
            },
                250);
        }
    });
});