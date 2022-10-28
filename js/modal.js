var loginLink = document.querySelector(".user-navigation .login-link");
var mapLink = document.querySelectorAll(".js-show-map");

var modalOverlay = document.querySelector(".modal-overlay");
var modalAuth = document.querySelector(".modal-auth");
var formAuth = modalAuth.querySelector(".login-form");
var loginField = modalAuth.querySelector("[name=login]");
var paswdField = modalAuth.querySelector("[name=password]");

var modalMap = document.querySelector(".modal-map");

var buttonClose, closingModal;

var isStorageSupport = true;
var storageLogin = '';

try {
  storageLogin = localStorage.getItem("login");
} catch {
  isStorageSupport = false;
}

// вызов окна авторизации
loginLink.addEventListener("click", evtShowModalLogin);
// отображение карты при клике на любую ссылку с картой
mapLink.forEach( function(elem) {
  elem.addEventListener("click", evtShowMap);  
});
// закрытие модальных окон по клику на оверлее
modalOverlay.addEventListener("click", evtCloseByOverlay);

// закрытие модальных окон по нажатию ESC
window.addEventListener("keydown", evtCloseByEsc );

// проверка полей формы авторизации при
loginField.addEventListener("input", evtLoginValidation );
paswdField.addEventListener("input", evtPaswdValidation );

// валидация формы авторизации при отправлении
formAuth.addEventListener("submit", evtFormValidation );

/**
 * Отображение модального окна авторизации с оверлеем
 * добавление обработчика закрытия окна
 */
function evtShowModalLogin(event) {
  event.preventDefault();

  modalOverlay.classList.add("modal-show");
  modalAuth.classList.add("modal-show");
  modalAuth.classList.add("modal-auth-show");
  setTimeout(function() {
    modalAuth.classList.remove("modal-auth-show");
  }, 700);

  buttonClose = modalAuth.querySelector(".modal-close");
  buttonClose.addEventListener("click", evtCloseModal);

  //проверяем введен ли логин. если нет - берем из localStorage
  if(!loginField.value && storageLogin ) {
    loginField.value = storageLogin;
  }
  // передаем фокус на первое свободное поле
  if(loginField.value) {
    modalAuth.querySelector("[name=password]").focus();
  } else {
    loginField.focus();
  }
}

/**
 * Отображение модального окна с картой и оверлеем
 * добавление обработчика закрытия окна
 */
function evtShowMap(event) {
  event.preventDefault();
  modalOverlay.classList.add("modal-show");
  modalMap.classList.add("modal-show");
  buttonClose = modalMap.querySelector(".modal-close");
  buttonClose.addEventListener("click", evtCloseModal);
  showFrameMap(modalMap);
}

/**
 * обработчик закрытия модального окна
 * которое ищется как ближайшего к buttonClose тэг с классом "modal"
*/
function evtCloseModal(event) {
  event.preventDefault();
  closingModal = buttonClose.closest(".modal");
  closingModal.classList.remove("modal-show");
  modalOverlay.classList.remove("modal-show");
}

/**
 * обработчик закрытия открытых модальных окон и оверлея по ESC 
 */
function evtCloseByEsc(event) {
  if( event.keyCode === 27 ) {
    closingModal = document.querySelectorAll(".modal-show");
    if(closingModal.length) {
      event.preventDefault();
      closingModal.forEach( function(elem) {
        elem.classList.remove("modal-show");
      });
      modalOverlay.classList.remove("modal-show");
    }
  }
}

/**
 * обработчик закрытия открытых модальных окон и оверлея по клику на оверлей
 */
function evtCloseByOverlay() {
  closingModal = document.querySelectorAll(".modal-show");
  closingModal.forEach( function(elem) {
    elem.classList.remove("modal-show");
  });
  modalOverlay.classList.remove("modal-show");
}


/**
 * Динамическая загрузка гугл-карты и замена статичного jpg в модальном окне карты
 */
function showFrameMap(map) {
  var frameMap = map.querySelector("iframe");
  if(frameMap === null ) {
    var frameWidth = 766;
    var frameHeight = 560;
    var mapImg = map.querySelector('img');
    if(mapImg !== null) {
      frameWidth = mapImg.width;
      frameHeight = mapImg.height;
    }
    frameMap = document.createElement("iframe");
    frameMap.className = "border0 modal-hide";
    frameMap.width = frameWidth;
    frameMap.height = frameHeight;
    frameMap.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1998.6036253003365!2d30.32085871651319!3d59.93871916905374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4696310fca145cc1%3A0x42b32648d8238007!2z0JHQvtC70YzRiNCw0Y8g0JrQvtC90Y7RiNC10L3QvdCw0Y8g0YPQuy4sIDE5LzgsINCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCzLCAxOTExODY!5e0!3m2!1sru!2sru!4v1561079752419!5m2!1sru!2sru"
    frameMap.title = frameMap.innerHTML = "Адрес барбершопа: г. Санкт-петербург, б. Конюшенная, д. 19/8";
    map.appendChild(frameMap);
    frameMap.addEventListener('load', function() {
      map.removeChild( map.querySelector("img"));
      frameMap.classList.remove("modal-hide");
    });
  }
}

/* удаление класса для индикации ошибки при изменении и не пустом значении */
function evtLoginValidation() {
  if ( loginField.value ) {
    loginField.classList.remove("border-error");
  }
}
function evtPaswdValidation() {
  if ( paswdField.value ) {
    paswdField.classList.remove("border-error");
  }
}

/**
 * Валидация формы авторизации при отправке
 */
function evtFormValidation(event) {
  if( !loginField.value || !paswdField.value ) {
    event.preventDefault();
    modalAuth.classList.remove("modal-error");
    modalAuth.classList.add("modal-error");
    if ( !loginField.value ) {
      loginField.classList.add("border-error");
      loginField.placeholder = "Введите логин";
    }
    if ( !paswdField.value ) {
      paswdField.classList.add("border-error");
      paswdField.placeholder = "Введите пароль";
    }
    setTimeout(function() {
      modalAuth.classList.remove("modal-error");
    }, 700);
  } else {
    /* сохраняем в LS логин если форма отправлена */
    if( isStorageSupport ) {
      localStorage.setItem("login", loginField.value);
    }
  }
}

/**
 * Смена фото в Фотогалерее на главной кнопками НАЗАД / ВПЕРЕД
 */
var currentImage = 0;
var galleryImg = document.querySelectorAll('.gallery .gallery-content img');
var galleryCount = galleryImg.length - 1;

var galleryPrev = document.querySelector('.gallery-button-prev');
if(galleryPrev !== null ) {
  galleryPrev.addEventListener("click", function() {
    galleryImg[currentImage].classList.remove('show');
    currentImage--;
    if(currentImage < 0) {
      currentImage = galleryCount;
    }
    galleryImg[currentImage].classList.add('show');
  });
}
var galleryNext = document.querySelector('.gallery-button-next');
if(galleryNext !== null ) {
  galleryNext.addEventListener("click", function() {
    galleryImg[currentImage].classList.remove('show');
    currentImage++;
    if(currentImage > galleryCount) {
      currentImage = 0;
    }
    galleryImg[currentImage].classList.add('show');
  });
}

/**
 Отображение модальной фотогалереи
 */
var gallery = document.querySelector('.gallery figure');
var modalGallery = document.querySelector('.modal-gallery');

if(gallery !== null ) {
  gallery.addEventListener('click', evtShowGallery);
  gallery.addEventListener('keydown', function (event) {
    if( event.keyCode === 32 ) {
      evtShowGallery(event);
    }
  });
}

function evtShowGallery(event) {
  event.preventDefault();
  modalOverlay.classList.add("modal-show");
  modalGallery.classList.add("modal-show");
  buttonClose = modalGallery.querySelector(".modal-close");
  buttonClose.addEventListener("click", evtCloseModal);
  buttonClose.focus();
}

/**
 * Навигация в модальной галерее
 */
var currentModalImage = 0;
if(modalGallery !== null ) {
  var modalGalleryPrev = modalGallery.querySelector('.button-prev');
  var modalGalleryImg = modalGallery.querySelector('img');
  modalGalleryPrev.addEventListener("click", function() {
    currentModalImage--;
    if(currentModalImage < 0) {
      currentModalImage = galleryCount;
    }
    modalGalleryImg.src = galleryImg[currentModalImage].src;
  });
  var modalGalleryNext = modalGallery.querySelector('.button-next');
  modalGalleryNext.addEventListener("click", function() {
    currentModalImage++;
    if(currentModalImage > galleryCount) {
      currentModalImage = 0;
    }
    modalGalleryImg.src = galleryImg[currentModalImage].src;
  });
}
