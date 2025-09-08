const navToggle = document.getElementById("nav-toggle")
const navLinks = document.getElementById("nav-links")

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    navToggle.classList.toggle("active")
  })
}

function closeMenu() {
  if (navLinks && navToggle) {
    navLinks.classList.remove("active")
    navToggle.classList.remove("active")
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  }
})

const contactForm = document.querySelector(".contact-form form")
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault()

    const name = this.querySelector('input[type="text"]').value.trim()
    const email = this.querySelector('input[type="email"]').value.trim()
    const message = this.querySelector("textarea").value.trim()

    if (!name || !email || !message) {
      showNotification("Please fill in all fields", "error")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address", "error")
      return
    }

    const submitBtn = this.querySelector(".btn")
    const originalText = submitBtn.textContent

    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (response.ok) {
        showNotification("Thank you for your message! I'll get back to you soon.", "success")
        this.reset()
      } else {
        showNotification(data.error || "Failed to send message. Please try again.", "error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showNotification("Network error. Please check your connection and try again.", "error")
    } finally {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  })
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === "success" ? "background: #10b981;" : ""}
    ${type === "error" ? "background: #ef4444;" : ""}
    ${type === "info" ? "background: #3b82f6;" : ""}
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".portfolio-item, .contact-item, .skills-column")

  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

const preloadLink = document.createElement("link")
preloadLink.rel = "preload"
preloadLink.as = "font"
preloadLink.type = "font/woff2"
preloadLink.crossOrigin = "anonymous"
document.head.appendChild(preloadLink)
