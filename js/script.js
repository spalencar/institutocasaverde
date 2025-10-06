// js/script.js
const API_URL = 'http://localhost:3000/api/content'; // URL da nossa API
let currentSlideIndex = 0;
let carouselData = []; // Inicializamos vazio, será preenchido pela API

// Função principal para buscar os dados e iniciar o carrossel
async function fetchAndRenderContent() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();

        // 1. Atualiza os dados globais
        carouselData = data.carrossel || [];

        // 2. Atualiza os textos da Home dinamicamente
        document.querySelector('.carousel-overlay h1').textContent = data.homeTexts.title;
        document.querySelector('.carousel-overlay h2').textContent = data.homeTexts.subtitle;

        // 3. Renderiza o carrossel com os dados da API
        renderCarousel();
        
        // 4. Inicia o avanço automático
        startAutoSlide();

    } catch (error) {
        console.error('Erro ao carregar o conteúdo do site via API:', error);
        // Opcional: Mostrar uma mensagem de erro na tela
    }
}

// O restante das funções do carrossel: renderCarousel, goToSlide, autoSlide, etc.
// Elas devem ser adaptadas para usar 'carouselData' global.

function renderCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselDotsContainer = document.querySelector('.carousel-dots');
    
    // Limpa o conteúdo anterior
    carouselInner.innerHTML = '';
    carouselDotsContainer.innerHTML = '';
    
    if (carouselData.length === 0) return; // Não faz nada se não houver dados

    carouselData.forEach((item, index) => {
        // 1. Cria o Slide
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        // A URL agora é resolvida pelo servidor Express
        slide.style.backgroundImage = `url(${item.image})`; 
        slide.setAttribute('aria-label', item.alt);
        
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        }
        carouselInner.appendChild(slide);

        // 2. Cria o Dot
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        carouselDotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    if (carouselData.length === 0) return;

    if (index >= carouselData.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = carouselData.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });

    if (slides[currentSlideIndex] && dots[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }
}

let slideInterval;

function autoSlide() {
    goToSlide(currentSlideIndex + 1);
}

function startAutoSlide() {
    // Garante que não haja múltiplos intervalos rodando
    if (slideInterval) clearInterval(slideInterval); 
    
    slideInterval = setInterval(autoSlide, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const carouselContainer = document.getElementById('hero-carousel');
    
    // Inicia o carregamento de dados do Backend
    fetchAndRenderContent();

    // Lógica do Menu Hamburguer (Mantenha ou adicione aqui a lógica da etapa anterior)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Navegação por setas (agora dependente de 'carouselData' ser preenchido)
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlideIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentSlideIndex + 1);
    });

    // Pausar o avanço automático ao passar o mouse sobre o carrossel
    carouselContainer.addEventListener('mouseenter', () => {
        if (slideInterval) clearInterval(slideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});