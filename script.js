const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const label = link.getAttribute("data-placeholder-label") || "this";
        alert(`Please add your ${label} link in index.html.`);
    });
});

const rotateWords = [
    ["ERP", "Solutions"],
    ["AI-Powered", "Solutions"],
    ["Odoo", "Solutions"],
    ["Business", "Systems"],
    ["Enterprise", "Software"],
    ["Reliable", "Integrations"]
];

const rotateRoot = document.querySelector(".hero-rotate");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (rotateRoot && !prefersReducedMotion) {
    const prefixEl = rotateRoot.querySelector(".rotate-prefix");
    const suffixEl = rotateRoot.querySelector(".rotate-suffix");

    if (prefixEl && suffixEl) {
        const TYPE_MS = 70;
        const DELETE_MS = 45;
        const HOLD_MS = 2200;

        let index = 0;

        function typeInto(el, text, done) {
            let pos = 0;
            (function step() {
                pos += 1;
                el.textContent = text.slice(0, pos);
                if (pos < text.length) {
                    window.setTimeout(step, TYPE_MS);
                } else {
                    done();
                }
            })();
        }

        function deleteFrom(el, done) {
            (function step() {
                const current = el.textContent;
                if (current.length > 0) {
                    el.textContent = current.slice(0, -1);
                    window.setTimeout(step, DELETE_MS);
                } else {
                    done();
                }
            })();
        }

        function runCycle() {
            const nextIndex = (index + 1) % rotateWords.length;
            const [nextPrefix, nextSuffix] = rotateWords[nextIndex];
            const suffixChanges = suffixEl.textContent !== nextSuffix;

            const toDelete = [prefixEl];
            if (suffixChanges) toDelete.push(suffixEl);
            let deletesLeft = toDelete.length;

            function onDeleted() {
                deletesLeft -= 1;
                if (deletesLeft === 0) beginTyping();
            }

            function beginTyping() {
                const toType = [[prefixEl, nextPrefix]];
                if (suffixChanges) toType.push([suffixEl, nextSuffix]);
                let typesLeft = toType.length;

                function onTyped() {
                    typesLeft -= 1;
                    if (typesLeft === 0) {
                        index = nextIndex;
                        window.setTimeout(runCycle, HOLD_MS);
                    }
                }

                toType.forEach(([el, text]) => typeInto(el, text, onTyped));
            }

            toDelete.forEach((el) => deleteFrom(el, onDeleted));
        }

        window.setTimeout(runCycle, HOLD_MS);
    }
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("active", isActive);
                    if (isActive) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            }
        });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
}

document.getElementById("current-year").textContent = new Date().getFullYear();

const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
    const updateHeaderShadow = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
}

const revealEls = [...document.querySelectorAll(".reveal")];

if (revealEls.length) {
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("in-view"));
    }
}
