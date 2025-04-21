import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectCoverflow } from 'swiper/modules';

var swiper = new Swiper('.swiper', {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      modules: [EffectCoverflow],
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
        loop: true,
      },
      loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,},
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    }
});
