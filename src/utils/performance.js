// Performance optimization utilities

// Debounce function for input handlers
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

// Throttle function for scroll handlers
export const throttle = (func, limit = 100) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Image compression utility for better performance
export const compressImage = async (file, maxWidth = 1920, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                canvas.toBlob(
                    (blob) => {
                        const compressedReader = new FileReader();
                        compressedReader.readAsDataURL(blob);
                        compressedReader.onloadend = () => {
                            resolve(compressedReader.result);
                        };
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// Local storage with size limit check
export const safeLocalStorageSet = (key, value) => {
    try {
        const stringValue = JSON.stringify(value);
        const sizeInBytes = new Blob([stringValue]).size;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        // Warn if approaching 5MB limit (localStorage typically has 5-10MB limit)
        if (sizeInMB > 4) {
            console.warn(`Storage size warning: ${sizeInMB.toFixed(2)}MB. Consider cleaning old data.`);
        }

        localStorage.setItem(key, stringValue);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('Storage quota exceeded. Clearing old data...');
            // Could implement cleanup logic here
            return false;
        }
        throw e;
    }
};

// Lazy load images
export const lazyLoadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    });
};
