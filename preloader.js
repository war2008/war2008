// preloader.js (cinematic warmup version)
(function () {

const config = {
    backgroundStart: 'rgba(0,0,0,0.75)',
    backgroundWarm: 'rgba(0,0,0,0.96)',
    blurStart: '6px',
    blurWarm: '18px',

    circleColor: 'rgba(255,255,255,0.25)',
    stripeColor: '#ff4444',

    circleSize: '90px',
    stripeWidth: '4px',
    animationSpeed: '0.9s',
    fadeOutTime: 500
};

class Preloader {

    constructor(config){
        this.config=config;
        this.progress=0;
        this.targetProgress=0;
    }

    isDesktop(){
        return window.matchMedia('(min-width:1024px)').matches &&
               !('ontouchstart' in window);
    }

    /* ---------- PROGRESS SHOW ---------- */

    startFakeProgress(){
        const tick=()=>{
            if(this.progress < this.targetProgress){
                this.progress += (this.targetProgress - this.progress)*0.08;
            }
            this.progressText.textContent =
                Math.floor(this.progress)+'%';
            requestAnimationFrame(tick);
        };
        tick();
    }

    setTarget(val){
        this.targetProgress=Math.min(100,val);
    }

    /* ---------- CREATE ---------- */

    create(){

        this.preloader=document.createElement('div');

        this.preloader.style.cssText=`
            position:fixed;
            inset:0;
            background:${config.backgroundStart};
            backdrop-filter:blur(${config.blurStart});
            display:flex;
            justify-content:center;
            align-items:center;
            z-index:9999;
            transition:
                opacity ${config.fadeOutTime}ms ease,
                backdrop-filter 600ms ease,
                background 600ms ease;
        `;

        const wrap=document.createElement('div');
        wrap.style.cssText=`
            position:relative;
            width:${config.circleSize};
            height:${config.circleSize};
        `;

        const circle=document.createElement('div');
        circle.style.cssText=`
            position:absolute;
            inset:0;
            border:${config.stripeWidth} solid ${config.circleColor};
            border-radius:50%;
        `;

        const stripe=document.createElement('div');
        stripe.style.cssText=`
            position:absolute;
            inset:0;
            border:${config.stripeWidth} solid transparent;
            border-top-color:${config.stripeColor};
            border-radius:50%;
            animation:spin ${config.animationSpeed} linear infinite;
        `;

        const percent=document.createElement('div');
        percent.style.cssText=`
            position:absolute;
            inset:0;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-family:monospace;
            font-size:17px;
            letter-spacing:1px;
        `;
        percent.textContent='0%';
        this.progressText=percent;

        this.addAnim();

        wrap.append(circle,stripe,percent);
        this.preloader.appendChild(wrap);

        return this.preloader;
    }

    addAnim(){
        if(document.getElementById('spin')) return;
        const s=document.createElement('style');
        s.id='spin';
        s.textContent=`
        @keyframes spin{
            from{transform:rotate(0)}
            to{transform:rotate(360deg)}
        }`;
        document.head.appendChild(s);
    }

    /* ---------- IMAGE LOAD ---------- */

    waitImages(){
        return new Promise(resolve=>{
            const imgs=[...document.images];
            if(!imgs.length){
                this.setTarget(30);
                return resolve();
            }

            let loaded=0;
            const done=()=>{
                loaded++;
                this.setTarget(10+(loaded/imgs.length)*25);
                if(loaded===imgs.length) resolve();
            };

            imgs.forEach(img=>{
                if(img.complete) done();
                else{
                    img.onload=done;
                    img.onerror=done;
                }
            });
        });
    }

    /* ---------- WARMUP ---------- */

    async mechanicalScroll() {

        if(!this.isDesktop()){
            this.setTarget(100);
            return;
        }

        this.preloader.style.background = config.backgroundWarm;
        this.preloader.style.backdropFilter = `blur(${config.blurWarm})`;

        const delay = ms => new Promise(r => setTimeout(r, ms));
        const sections = [...document.querySelectorAll('section,[data-snap],[class*="section"]')];

        if(!sections.length){
            this.setTarget(100);
            return;
        }

        document.documentElement.style.scrollBehavior = 'auto';
        let step = 0;
        const total = sections.length;

        /* вниз — быстро */
        for(const s of sections){
            s.scrollIntoView({block:'start'});
            step++;
            this.setTarget(35 + (step/total)*55);
            await delay(60);
        }

        /* моментальный скролл к #hero */
        const hero = document.getElementById('hero');
        if(hero) hero.scrollIntoView({block:'start'});

        this.setTarget(100);
        await delay(120);
    }

    /* ---------- INIT ---------- */

    async init(){

        const preloader=this.create();
        document.body.appendChild(preloader);

        this.startFakeProgress();

        await this.waitImages();

        return new Promise(resolve=>{

            window.addEventListener('load',async()=>{

                this.setTarget(40);

                await this.mechanicalScroll();

                setTimeout(()=>{
                    preloader.style.opacity='0';
                    setTimeout(()=>{
                        preloader.remove();
                        resolve();
                    },config.fadeOutTime);
                },400);

            });

        });
    }
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>new Preloader(config).init());
}else{
    new Preloader(config).init();
}

})();