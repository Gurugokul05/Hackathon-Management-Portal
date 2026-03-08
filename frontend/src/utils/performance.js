/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with intersection observer
 * @param {HTMLImageElement} img - Image element to lazy load
 */
export const lazyLoadImage = (img) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          observer.unobserve(lazyImage);
        }
      });
    },
    { rootMargin: "50px" },
  );

  if (img) {
    observer.observe(img);
  }
};

/**
 * Optimize large list rendering with virtual scrolling helper
 * @param {Array} items - Full list of items
 * @param {number} startIndex - Start index for visible items
 * @param {number} endIndex - End index for visible items
 * @returns {Array} Slice of items to render
 */
export const getVisibleItems = (items, startIndex, endIndex) => {
  return items.slice(startIndex, endIndex);
};
