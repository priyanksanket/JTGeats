const foodItems = [
  {
    title: 'Home made pizza',
    image: 'assets/food1.png',
    price: '₹190',
    rating: '4.7',
    time: '50-79 min',
    discount: '50%'
  },
  {
    title: 'Tandoori Chicken',
    image: 'assets/tandooriChicken.png',
    price: '₹184',
    rating: '4.3',
    time: '15-29 min',
    discount: ''
  },
  {
    title: 'Chilli Chicken',
    image: 'assets/chillichicken.png',
    price: '₹116',
    rating: '4.1',
    time: '30-40 min',
    discount: '50%'
  },
  {
    title: 'Cheese Burst Pizza',
    image: 'assets/food4.png',
    price: '₹210',
    rating: '4.6',
    time: '40-50 min',
    discount: ''
  },
  {
    title: 'Paneer Tikka Wrap',
    image: 'assets/food5.png',
    price: '₹149',
    rating: '4.4',
    time: '25-35 min',
    discount: '15%'
  },
  {
    title: 'Masala Sandwich',
    image: 'assets/food6.png',
    price: '₹129',
    rating: '4.2',
    time: '20-30 min',
    discount: ''
  },
  {
    title: 'Veggie Delight Pizza',
    image: 'assets/food7.png',
    price: '₹199',
    rating: '4.7',
    time: '35-45 min',
    discount: '15%'
  },
  {
    title: 'Butter Paneer Bowl',
    image: 'assets/food8.png',
    price: '₹229',
    rating: '4.6',
    time: '30-45 min',
    discount: ''
  },
  {
    title: 'Garden Fresh Salad',
    image: 'assets/food9.png',
    price: '₹159',
    rating: '4.3',
    time: '15-25 min',
    discount: ''
  }
];

const kitchenGrid = document.getElementById('kitchenGrid');
const carouselTrack = document.getElementById('carouselTrack');
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

function closeMobileMenu(){

  navbar.classList.remove('menu-open');

  mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

mobileMenuBtn.addEventListener('click', () => {

  const isOpen = navbar.classList.toggle('menu-open');

  mobileMenuBtn.setAttribute('aria-expanded', isOpen);
});

navbar.querySelectorAll('.nav-links a').forEach(link => {

  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('resize', () => {
  if(window.innerWidth > 768){

    closeMobileMenu();
  }
});

function createCard(item){

  return `
  
    <article class="food-card">

      <div class="card-image">

        <img src="${item.image}" alt="${item.title}">

        ${item.discount ? `
          <span class="discount-tag">
            ${item.discount}
          </span>
        ` : ''}

      </div>

      <div class="card-body">

        <div class="card-top">

          <h3>${item.title}</h3>

          <p>${item.price}</p>

        </div>

        <div class="card-bottom">

          <span class="rating">
            <img src="assets/star.svg" alt="" aria-hidden="true">
            ${item.rating}
          </span>

          <span class="time">
            ${item.time}
          </span>

          <div class="card-actions">

            <button class="add-btn" type="button" aria-label="Add ${item.title}">
              <img src="assets/plus.svg" alt="" aria-hidden="true">
            </button>

            <div class="quantity-control" data-count="0">

              <button class="qty-btn decrease-btn" type="button" aria-label="Decrease ${item.title}">
                <img src="assets/minus.svg" alt="" aria-hidden="true">
              </button>

              <span class="qty-count">1</span>

              <button class="qty-btn increase-btn" type="button" aria-label="Increase ${item.title}">
                <img src="assets/plus.svg" alt="" aria-hidden="true">
              </button>

            </div>

          </div>

        </div>

      </div>

    </article>
  `;
}

function setQuantity(control, count){

  const actions = control.closest('.card-actions');

  const addButton = actions.querySelector('.add-btn');

  const countLabel = control.querySelector('.qty-count');

  control.dataset.count = count;

  countLabel.textContent = count;

  addButton.classList.toggle('hidden', count > 0);

  control.classList.toggle('active', count > 0);
}

/* KITCHEN GRID */

for(let i = 0; i < 12; i++){

  kitchenGrid.innerHTML += createCard(
    foodItems[i % foodItems.length]
  );
}

/* CAROUSEL */

const nextBtn = document.getElementById('nextBtn');

const prevBtn = document.getElementById('prevBtn');

const cloneBuffer = 3;

let currentSlide = cloneBuffer;

let isCarouselMoving = false;

const carouselItems = [
  ...foodItems.slice(-cloneBuffer),
  ...foodItems,
  ...foodItems.slice(0, cloneBuffer)
];

carouselItems.forEach(item => {

  carouselTrack.innerHTML += createCard(item);

});

function getCardWidth(){

  const card = carouselTrack.querySelector('.food-card');

  if(!card){

    return 0;
  }

  const trackGap =
    parseFloat(getComputedStyle(carouselTrack).gap) || 0;

  return card.getBoundingClientRect().width + trackGap;
}

function updateCarousel(animate = true){

  const cardWidth = getCardWidth();

  if(!cardWidth){

    return;
  }

  carouselTrack.style.transition =
    animate ? 'transform .4s ease' : 'none';

  carouselTrack.style.transform =
    `translateX(-${currentSlide * cardWidth}px)`;

  carouselTrack.classList.add('is-ready');

  if(!animate){

    carouselTrack.offsetHeight;

    carouselTrack.style.transition = 'transform .4s ease';
  }
}

function moveCarousel(direction){

  if(isCarouselMoving){

    return;
  }

  isCarouselMoving = true;

  currentSlide += direction;

  updateCarousel();
}

requestAnimationFrame(() => {

  currentSlide = cloneBuffer;

  updateCarousel(false);
});

nextBtn.addEventListener('click', () => {

  moveCarousel(1);
});

prevBtn.addEventListener('click', () => {

  moveCarousel(-1);
});

carouselTrack.addEventListener('transitionend', (e) => {

  if(e.propertyName !== 'transform'){

    return;
  }

  if(currentSlide >= foodItems.length + cloneBuffer){

    currentSlide = cloneBuffer;

    updateCarousel(false);

  }else if(currentSlide < cloneBuffer){

    currentSlide = foodItems.length + cloneBuffer - 1;

    updateCarousel(false);
  }

  isCarouselMoving = false;
});

window.addEventListener('resize', () => {

  isCarouselMoving = false;

  updateCarousel(false);
});

window.addEventListener('load', () => {

  currentSlide = cloneBuffer;

  isCarouselMoving = false;

  updateCarousel(false);
});

document.addEventListener('click', (e) => {

  const addButton = e.target.closest('.add-btn');

  const increaseButton = e.target.closest('.increase-btn');

  const decreaseButton = e.target.closest('.decrease-btn');

  if(addButton){

    const control =
      addButton.closest('.card-actions').querySelector('.quantity-control');

    setQuantity(control, 1);

    return;
  }

  if(increaseButton){

    const control = increaseButton.closest('.quantity-control');

    const count = Number(control.dataset.count) + 1;

    setQuantity(control, count);

    return;
  }

  if(decreaseButton){

    const control = decreaseButton.closest('.quantity-control');

    const count = Math.max(0, Number(control.dataset.count) - 1);

    setQuantity(control, count);
  }
});

/* MODAL */

const modalOverlay =
  document.getElementById('modalOverlay');

const openModalBtn =
  document.getElementById('openModalBtn');

const cancelModalBtn =
  document.getElementById('cancelModalBtn');

function openModal(){

  modalOverlay.classList.add('active');

  document.body.classList.add('no-scroll');
}

function closeModal(){

  modalOverlay.classList.remove('active');

  document.body.classList.remove('no-scroll');
}

openModalBtn.addEventListener('click', openModal);

cancelModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {

  if(e.target === modalOverlay){

    closeModal();
  }
});

/* VIDEO */

const video =
  document.getElementById('promoVideo');

const playBtn =
  document.getElementById('playBtn');

function toggleVideo(){

  if(video.paused){

    video.play();

    playBtn.style.display = 'none';

  }else{

    video.pause();

    playBtn.style.display = 'flex';
  }
}

playBtn.addEventListener('click', toggleVideo);

video.addEventListener('click', toggleVideo);

video.addEventListener('pause', () => {

  playBtn.style.display = 'flex';
});

video.addEventListener('play', () => {

  playBtn.style.display = 'none';
});
