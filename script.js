// --- Three.js Dynamic Data Grid Animation ---
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = 0;
let windowHalfY = 0;

function initThreeJS() {
    const container = document.getElementById('hero-threejs-container');
    if (!container) {
        console.error("Three.js container not found!");
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 10000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const color = new THREE.Color();
    const particleSize = 3;

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        positions.push(x, y, z);

        color.setHSL(0.6 + Math.random() * 0.2, 0.5, 0.5 + Math.random() * 0.2);
        colors.push(color.r, color.g, color.b);
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: particleSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x007bff,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });

    const maxLineDistance = 150;

    function createLines() {
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const p1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                const p2 = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                if (p1.distanceTo(p2) < maxLineDistance) {
                    linePositions.push(p1.x, p1.y, p1.z);
                    linePositions.push(p2.x, p2.y, p2.z);
                }
            }
        }
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);
    }
    createLines();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
}

function onDocumentMouseMove(event) {
    const container = document.getElementById('hero-threejs-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        mouseX = (event.clientX - rect.left - rect.width / 2);
        mouseY = (event.clientY - rect.top - rect.height / 2);
    }
}

function onWindowResize() {
    const container = document.getElementById('hero-threejs-container');
    if (container) {
        windowHalfX = container.clientWidth / 2;
        windowHalfY = container.clientHeight / 2;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    particleSystem.rotation.y += 0.0005;
    particleSystem.rotation.x += 0.0002;

    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// --- Scroll-triggered "Algorithmic Reveal" Animation ---
const sections = document.querySelectorAll('.section');
const projectCards = document.querySelectorAll('.project-card');
const skillCards = document.querySelectorAll('.skill-card');
const timelineItems = document.querySelectorAll('.timeline-item');
const awardCard = document.querySelector('.award-card');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            // entry.target.classList.remove('is-visible'); // Optional: re-animate on scroll back up
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));
projectCards.forEach(card => observer.observe(card));
skillCards.forEach(card => observer.observe(card));
timelineItems.forEach(item => observer.observe(item));
if (awardCard) observer.observe(awardCard);


// --- Mobile Hamburger Menu Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const sidebarNav = document.querySelector('.sidebar-nav');

    if (hamburgerToggle && sidebarMenu && sidebarNav) {
        hamburgerToggle.addEventListener('click', () => {
            sidebarMenu.classList.toggle('is-open');
            hamburgerToggle.classList.toggle('is-active');
            sidebarNav.classList.toggle('menu-open'); 
        });

        sidebarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebarMenu.classList.remove('is-open');
                    hamburgerToggle.classList.remove('is-active');
                    sidebarNav.classList.remove('menu-open');
                }
            });
        });
    }
});


// --- Initialize on Load ---
window.onload = function() {
    initThreeJS();
    animateThreeJS();
};
