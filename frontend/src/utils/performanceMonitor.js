/**
 * Performance Monitoring Utility
 * Tracks page load times, API response times, and component render times
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: 0,
      apiCalls: [],
      componentRenders: new Map(),
    };
  }

  // Track page load performance
  trackPageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.pageLoad = loadTime;

      if (process.env.NODE_ENV === "development") {
        console.log(`Page Load Time: ${loadTime}ms`);
      }
    }
  }

  // Track API call performance
  trackApiCall(endpoint, duration, status) {
    this.metrics.apiCalls.push({
      endpoint,
      duration,
      status,
      timestamp: Date.now(),
    });

    // Keep only last 100 API calls to prevent memory issues
    if (this.metrics.apiCalls.length > 100) {
      this.metrics.apiCalls.shift();
    }

    if (process.env.NODE_ENV === "development" && duration > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
    }
  }

  // Track component render time
  trackComponentRender(componentName, duration) {
    if (!this.metrics.componentRenders.has(componentName)) {
      this.metrics.componentRenders.set(componentName, []);
    }

    const renders = this.metrics.componentRenders.get(componentName);
    renders.push({ duration, timestamp: Date.now() });

    // Keep only last 50 renders per component
    if (renders.length > 50) {
      renders.shift();
    }

    if (process.env.NODE_ENV === "development" && duration > 100) {
      console.warn(`Slow render detected: ${componentName} took ${duration}ms`);
    }
  }

  // Get average API response time
  getAverageApiTime() {
    if (this.metrics.apiCalls.length === 0) return 0;
    const total = this.metrics.apiCalls.reduce(
      (sum, call) => sum + call.duration,
      0,
    );
    return Math.round(total / this.metrics.apiCalls.length);
  }

  // Get average render time for a component
  getAverageRenderTime(componentName) {
    const renders = this.metrics.componentRenders.get(componentName);
    if (!renders || renders.length === 0) return 0;
    const total = renders.reduce((sum, render) => sum + render.duration, 0);
    return Math.round(total / renders.length);
  }

  // Get performance summary
  getSummary() {
    return {
      pageLoadTime: this.metrics.pageLoad,
      averageApiTime: this.getAverageApiTime(),
      totalApiCalls: this.metrics.apiCalls.length,
      componentsTracked: this.metrics.componentRenders.size,
    };
  }

  // Clear all metrics
  clear() {
    this.metrics = {
      pageLoad: 0,
      apiCalls: [],
      componentRenders: new Map(),
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Track page load when DOM is ready
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    performanceMonitor.trackPageLoad();
  });
}

export default performanceMonitor;

/**
 * React Hook for tracking component render performance
 */
export const usePerformanceTracking = (componentName) => {
  if (process.env.NODE_ENV === "production") return; // Only track in development

  const startTime = performance.now();

  React.useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    performanceMonitor.trackComponentRender(componentName, duration);
  });
};
