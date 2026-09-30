

/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const galleryGrid = document.getElementById("galleryGrid");
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");
const photoCount = document.getElementById("photoCount");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");

const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

/* =========================================
   2. GALLERY DATA
========================================= */

const allImages = Array.from(galleryItems).map((item) => {
    const image = item.querySelector("img");
    const title = item.querySelector("h3");
    const category = item.querySelector(".image-info p");

    return {
        element: item,
        src: image.src,
        alt: image.alt,
        title: title.textContent.trim(),
        category: category.textContent.trim(),
        categoryKey: item.dataset.category
    };
});

let visibleImages = [...allImages];
let currentIndex = 0;
let lastFocusedElement = null;

/* =========================================
   3. UPDATE PHOTO COUNT
========================================= */

function updatePhotoCount() {
    const total = visibleImages.length;

    photoCount.textContent =
        `${total} ${total === 1 ? "Photo" : "Photos"}`;
}

/* =========================================
   4. CATEGORY FILTERS
========================================= */

function filterGallery(category) {
    visibleImages = allImages.filter((image) => {
        return category === "all" ||
            image.categoryKey === category;
    });

    allImages.forEach((image) => {
        const isVisible = visibleImages.includes(image);

        image.element.classList.toggle("hidden", !isVisible);
    });

    currentIndex = 0;
    updatePhotoCount();
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;

        filterButtons.forEach((btn) => {
            const isActive = btn === button;

            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });

        filterGallery(category);
    });
});

/* =========================================
   5. OPEN LIGHTBOX
========================================= */

function openLightbox(index) {
    if (visibleImages.length === 0) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;

    showCurrentImage();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeLightbox.focus();
}

/* =========================================
   6. DISPLAY CURRENT IMAGE
========================================= */

function showCurrentImage() {
    if (visibleImages.length === 0) return;

    const image = visibleImages[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;

    prevImage.disabled = visibleImages.length <= 1;
    nextImage.disabled = visibleImages.length <= 1;
}

/* =========================================
   7. NEXT IMAGE
========================================= */

function showNextImage() {
    if (visibleImages.length <= 1) return;

    currentIndex =
        (currentIndex + 1) % visibleImages.length;

    showCurrentImage();
}

/* =========================================
   8. PREVIOUS IMAGE
========================================= */

function showPreviousImage() {
    if (visibleImages.length <= 1) return;

    currentIndex =
        (currentIndex - 1 + visibleImages.length) %
        visibleImages.length;

    showCurrentImage();
}

/* =========================================
   9. CLOSE LIGHTBOX
========================================= */

function closeImageViewer() {
    if (!lightbox.classList.contains("open")) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.src = "";
    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

/* =========================================
   10. IMAGE CLICK EVENTS
========================================= */

galleryItems.forEach((item) => {
    const button = item.querySelector(".image-button");

    button.addEventListener("click", () => {
        const index = visibleImages.findIndex(
            (image) => image.element === item
        );

        if (index !== -1) {
            openLightbox(index);
        }
    });
});

/* =========================================
   11. LIGHTBOX BUTTON EVENTS
========================================= */

closeLightbox.addEventListener("click", closeImageViewer);

nextImage.addEventListener("click", showNextImage);

prevImage.addEventListener("click", showPreviousImage);

/* Close when clicking the dark background */
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeImageViewer();
    }
});

/* =========================================
   12. KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeImageViewer();
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
    }
});

/* =========================================
   13. INITIALIZE GALLERY
========================================= */

updatePhotoCount();

filterButtons.forEach((button) => {
    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );
});

console.log("Pixora Image Gallery loaded successfully!");