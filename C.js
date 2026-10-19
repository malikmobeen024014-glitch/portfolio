/* =========================================================
   MALIK MUBEEN | FRONTEND WEB DEVELOPER
   File: script.js

   Features:
   1. Accessible mobile navigation
   2. Smooth section navigation
   3. Active navigation links
   4. Contact form validation
   5. Back-to-top button
   6. Dynamic footer year

   No frameworks or external libraries.
========================================================= */


/* =========================================================
   1. SELECT HTML ELEMENTS
========================================================= */

// Select the mobile menu button.
const menuToggle = document.querySelector(".menu-toggle");

// Select the navigation container.
const mainNav = document.querySelector(".main-nav");

// Select all navigation links.
const navLinks = document.querySelectorAll(".nav-link");

// Select the contact form.
const contactForm = document.querySelector(".contact-form");

// Select the back-to-top button.
const backToTop = document.querySelector(".back-to-top");

// Select the footer copyright element.
const footerCopyright = document.querySelector(".footer-copyright");


/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */

// Check whether the mobile menu is open.
const isMenuOpen = () => {
    return mainNav?.classList.contains("active") ?? false;
};


// Open or close the mobile menu.
const setMenuState = (shouldOpen) => {

    // Stop if the required HTML elements do not exist.
    if (!menuToggle || !mainNav) {
        return;
    }

    // Add or remove the active class.
    mainNav.classList.toggle("active", shouldOpen);

    // Update the accessibility state.
    menuToggle.setAttribute(
        "aria-expanded",
        String(shouldOpen)
    );

    // Update the accessible label.
    menuToggle.setAttribute(
        "aria-label",
        shouldOpen ? "Close navigation menu" : "Open navigation menu"
    );

    // Update the menu button's visible state if CSS supports it.
    menuToggle.classList.toggle("active", shouldOpen);
};


// Toggle the menu when the button is clicked.
if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
        setMenuState(!isMenuOpen());
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && isMenuOpen()) {
            setMenuState(false);

            // Return keyboard focus to the menu button.
            menuToggle.focus();
        }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {

        if (!isMenuOpen()) {
            return;
        }

        const clickedInsideMenu = mainNav.contains(event.target);
        const clickedMenuButton = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            setMenuState(false);
        }
    });

    // Close the menu if the screen becomes desktop-sized.
    window.addEventListener("resize", () => {

        if (window.innerWidth > 768 && isMenuOpen()) {
            setMenuState(false);
        }
    });
}


/* =========================================================
   3. NAVIGATION LINKS
========================================================= */

// Handle links that point to sections on this page.
navLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        // Read the link destination, such as #about.
        const targetId = link.getAttribute("href");

        // Ignore links without an internal section destination.
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        // Find the destination section safely.
        const targetSection = document.getElementById(
            targetId.slice(1)
        );

        // If the section does not exist, allow normal browser behavior.
        if (!targetSection) {
            return;
        }

        // Prevent the default jump because we handle scrolling.
        event.preventDefault();

        // Respect the user's reduced-motion preference.
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Scroll to the destination section.
        targetSection.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });

        // Update the URL hash without jumping again.
        if (window.location.hash !== targetId) {
            history.replaceState(null, "", targetId);
        }

        // Close the mobile menu after selecting a section.
        setMenuState(false);
    });
});


/* =========================================================
   4. ACTIVE NAVIGATION LINK
========================================================= */

// Find the page sections that have IDs.
const pageSections = document.querySelectorAll(
    "main section[id], body > section[id]"
);


// Update the active navigation link.
const updateActiveNavigation = () => {

    // Do nothing if there are no sections or links.
    if (!pageSections.length || !navLinks.length) {
        return;
    }

    // Find the section closest to the top of the viewport.
    let currentSectionId = "";

    const activationPoint = window.innerHeight * 0.35;

    pageSections.forEach((section) => {

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= activationPoint) {
            currentSectionId = section.id;
        }
    });

    // Update each navigation link.
    navLinks.forEach((link) => {

        const linkTarget = link.getAttribute("href");

        const isActive = linkTarget === `#${currentSectionId}`;

        if (isActive) {
            link.classList.add("active");
            link.setAttribute("aria-current", "location");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
};


// Update navigation on scroll and page load.
window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

window.addEventListener("load", updateActiveNavigation);

updateActiveNavigation();


/* =========================================================
   5. CONTACT FORM VALIDATION
========================================================= */

// Display a message in the form's feedback element.
const showFormFeedback = (message, isError = false) => {

    if (!contactForm) {
        return;
    }

    // Find an existing feedback element.
    let feedback = contactForm.querySelector(".form-feedback");

    // Create one if the HTML does not already contain it.
    if (!feedback) {
        feedback = document.createElement("p");
        feedback.className = "form-feedback";
        feedback.setAttribute("role", "status");
        feedback.setAttribute("aria-live", "polite");

        contactForm.appendChild(feedback);
    }

    // Use textContent to insert text safely.
    feedback.textContent = message;

    // Indicate whether the feedback describes an error.
    feedback.setAttribute(
        "role",
        isError ? "alert" : "status"
    );

    feedback.style.color = isError ? "#ff5555" : "#b8b8b8";
};


// Check whether an email address has a reasonable format.
const isValidEmail = (email) => {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
};


// Validate the contact form when submitted.
if (contactForm) {

    // Make the feedback accessible if it already exists.
    const existingFeedback = contactForm.querySelector(
        ".form-feedback"
    );

    if (existingFeedback) {
        existingFeedback.setAttribute("role", "status");
        existingFeedback.setAttribute("aria-live", "polite");
    }

    contactForm.addEventListener("submit", (event) => {

        // Prevent the page from reloading.
        event.preventDefault();

        // Get the form fields using their actual HTML names.
        const nameField = contactForm.querySelector(
            '[name="name"], #name'
        );

        const emailField = contactForm.querySelector(
            '[name="email"], #email'
        );

        const subjectField = contactForm.querySelector(
            '[name="subject"], #subject'
        );

        const messageField = contactForm.querySelector(
            '[name="message"], #message'
        );

        // Check whether all required fields exist.
        if (
            !nameField ||
            !emailField ||
            !subjectField ||
            !messageField
        ) {
            showFormFeedback(
                "The contact form fields could not be found. Please check your HTML.",
                true
            );

            return;
        }

        // Remove whitespace from the beginning and end.
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const subject = subjectField.value.trim();
        const message = messageField.value.trim();

        // Clear the old feedback before validating again.
        showFormFeedback("");

        // Check for empty fields.
        if (!name || !email || !subject || !message) {

            showFormFeedback(
                "Please complete all fields before continuing.",
                true
            );

            // Focus the first empty field.
            const firstEmptyField = [
                nameField,
                emailField,
                subjectField,
                messageField
            ].find((field) => !field.value.trim());

            firstEmptyField?.focus();

            return;
        }

        // Validate the email format.
        if (!isValidEmail(email)) {

            showFormFeedback(
                "Please enter a valid email address.",
                true
            );

            emailField.focus();

            return;
        }

        // The frontend has validated the form successfully.
        // It has NOT sent an email or stored a message on a server.
        showFormFeedback(
            "Your form is valid! Email delivery requires a backend or a form service."
        );

        // Do not clear the fields because no message was sent.
    });
}


/* =========================================================
   6. BACK-TO-TOP BUTTON
========================================================= */

// Show or hide the back-to-top button based on scroll position.
const updateBackToTop = () => {

    if (!backToTop) {
        return;
    }

    const shouldShow = window.scrollY > 400;

    backToTop.hidden = !shouldShow;
};


// Configure the button if it exists.
if (backToTop) {

    // Hide it initially if the page is near the top.
    updateBackToTop();

    // Update its visibility when scrolling.
    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    // Scroll to the top when clicked.
    backToTop.addEventListener("click", () => {

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}


/* =========================================================
   7. DYNAMIC FOOTER YEAR
========================================================= */

// Update the year only if the copyright element exists.
if (footerCopyright) {

    const currentYear = new Date().getFullYear();

    // Replace a year placeholder if one exists.
    if (footerCopyright.querySelector("[data-year]")) {

        footerCopyright.querySelector("[data-year]").textContent =
            currentYear;

    } else {

        // Update only when the HTML explicitly includes a year.
        const yearPattern = /\b(202\d|203\d)\b/;

        if (yearPattern.test(footerCopyright.textContent)) {

            footerCopyright.textContent =
                footerCopyright.textContent.replace(
                    yearPattern,
                    currentYear
                );
        }
    }
}


/* =========================================================
   8. INITIAL ACCESSIBILITY SETUP
========================================================= */

// Set the initial menu state when the page loads.
if (menuToggle && mainNav) {

    const menuInitiallyOpen = mainNav.classList.contains("active");

    menuToggle.setAttribute(
        "aria-expanded",
        String(menuInitiallyOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        menuInitiallyOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
}