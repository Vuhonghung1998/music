const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC';

const cd = $('.cd');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const btnPlay = $('.btn-toggle-play')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false, 
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value){
        this.config[key] =value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name:'Ai chung tình được mãi',
            singer: 'Đinh Tùng Huy',
            path:'./assets/music/1.mp3',
            image:"./assets/img/1.jpg"
        },
        {
            name:'Anh vẫn ở đây',
            singer: 'Thành Đạt',
            path:'./assets/music/2.mp3',
            image:"./assets/img/2.jpg"
        },
        {
            name:'Phải khóc hay cười',
            singer: 'HKT',
            path:'./assets/music/3.mp3',
            image:"./assets/img/3.png"
        },
        {
            name:'Nếu em còn tồn tại',
            singer: 'Trịnh Đình Quang',
            path:'./assets/music/4.mp3',
            image:"./assets/img/4.jpg"
        },
        {
            name:'Thất tình',
            singer: 'Trịnh Đình Quang',
            path:'./assets/music/5.mp3',
            image:"./assets/img/5.jpg"
        },
        {
            name:'Xin lỗi người anh yêu',
            singer: 'Châu Khải Phong',
            path:'./assets/music/6.mp3',
            image:"./assets/img/6.jpg"
        },
        {
            name:'Từ chối nhẹ nhàng thôi',
            singer: 'Bích phương',
            path:'./assets/music/7.mp3',
            image:"./assets/img/7.jpg"
        },
        {
            name:'Phận duyên lỡ làng',
            singer: 'Phát Huy',
            path:'./assets/music/8.mp3',
            image:"./assets/img/8.jpg"
        },
        {
            name:'Cố giang tình',
            singer: 'X2X',
            path:'./assets/music/9.mp3',
            image:"./assets/img/9.jpg"
        },
        {
            name:'Bông hoa đẹp nhất',
            singer: 'Quân AP',
            path:'./assets/music/10.mp3',
            image:"./assets/img/10.jpg"
        },
    ],
    defineProperties: function (){
        Object.defineProperty(this, 'currentSong',{
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function (){
        const htmls = this.songs.map((song, index) =>{
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
       $('.playlist').innerHTML = htmls.join('');
    },
    handleEvents: function (){
        // Xử lý quay dừng hình ảnh
        const cdThumbAnimate = cd.animate([
            {transform: 'rotate(360deg)'} //Quay 360 độ
        ],{
            duration: 10000,
            iterations:Infinity,
        });
        cdThumbAnimate.pause();
        
        // xu ly cuon chuot de phong to cd
        const cdWidth = cd.offsetWidth;
        document.onscroll = function (){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width =  newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //xu li khi click play
        btnPlay.onclick = function(){
            if(!app.isPlaying){
                audio.play();
            }else{ 
                audio.pause();
            }

        }
        //khi audio được play
        audio.onplay = function (){
            app.isPlaying=true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        //khi audio được pause
        audio.onpause = function (){
            app.isPlaying=false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function (){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua bài hát

        progress.onchange = function(){
            const seekTime = progress.value/100 * audio.duration;
            audio.currentTime = seekTime;
        },

        //xử lí khi next bài hát
        nextBtn.onclick = function (){
            if(app.isRandom){
                app.randomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
           
        }
        //xử lí khi prev bài hát
        prevBtn.onclick = function (){
            if(app.isRandom){
                app.randomSong();
            }else{
                app.prevSong();
            }
            audio.play();
            app.render();
        }
        //xử lý khi hết bài hát sẽ chuyển bài mới

        audio.onended = function () {
            if(app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }       
         // Xử lý khi ấn random
        btnRandom.onclick = function () {
            app.isRandom =!app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            btnRandom.classList.toggle('active', app.isRandom);
        }
        //Xử lí khi ấn Repeat
        btnRepeat.onclick = function(){
            app.isRepeat =!app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            btnRepeat.classList.toggle('active', app.isRepeat);
        }
        //PHát nhạc khi click vào bài hát đó
        playlist.onclick  = function (e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }

                if (e.target.closest('.option')) {
                    console.log(123)
                }
            }
        }
        
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage =`url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
    },
    loadConfig: function (){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function (){
        this.currentIndex++;
         if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;   
        }
        this.loadCurrentSong();
    },
    prevSong: function (){
        this.currentIndex--;
         if (this.currentIndex <0){
            this.currentIndex = this.songs.length - 1;   
        }
        this.loadCurrentSong();
    },
    randomSong: function (){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    
    start: function(){
        // gán cấu hình vào ứng dụng đọc từ local storage is
        this.loadConfig();
        // Định nghĩa các thuộc tính cho OBJ
        this.defineProperties();
        //tải bài hát dau tien
        this.loadCurrentSong();
        //Xử lý DOM
        this.handleEvents();
        // Render
        this.render();
        btnRandom.classList.toggle('active', app.isRandom);
        btnRepeat.classList.toggle('active', app.isRepeat);
        
    }
}

app.start();