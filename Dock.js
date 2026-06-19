class Dock {
    constructor({
        items = [],
        className = '',
        distance = 200,
        panelHeight = 68,
        baseItemSize = 50,
        magnification = 70
    } = {}) {
        this.items = items;
        this.className = className;
        this.distance = distance;
        this.panelHeight = panelHeight;
        this.baseItemSize = baseItemSize;
        this.magnification = magnification;
        
        this.init();
    }
    
    init() {
        // Create outer container
        this.outer = document.createElement('div');
        this.outer.className = `dock-outer ${this.className}`;
        
        // Create panel
        this.panel = document.createElement('div');
        this.panel.className = 'dock-panel';
        this.panel.style.height = `${this.panelHeight}px`;
        this.panel.setAttribute('role', 'toolbar');
        this.panel.setAttribute('aria-label', 'Application dock');
        
        this.itemElements = [];
        
        this.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = `dock-item ${item.className || ''}`;
            btn.style.width = `${this.baseItemSize}px`;
            btn.style.height = `${this.baseItemSize}px`;
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-label', item.label);
            btn.setAttribute('data-page', item.page);
            
            btn.onclick = (e) => {
                if (item.onClick) {
                    item.onClick(e);
                }
            };
            
            // Icon
            const iconDiv = document.createElement('div');
            iconDiv.className = 'dock-icon';
            iconDiv.innerHTML = item.icon;
            btn.appendChild(iconDiv);
            
            // Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'dock-label';
            labelDiv.textContent = item.label;
            btn.appendChild(labelDiv);
            
            this.panel.appendChild(btn);
            this.itemElements.push({
                element: btn,
                baseSize: this.baseItemSize
            });
        });
        
        this.outer.appendChild(this.panel);
        document.body.appendChild(this.outer);
        
        this.setupMagnification();
    }
    
    setupMagnification() {
        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            this.itemElements.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const dist = Math.abs(mouseX - itemCenterX);
                
                let size = this.baseItemSize;
                if (dist < this.distance) {
                    const factor = 1 - (dist / this.distance); // 0 to 1
                    const smoothFactor = Math.sin(factor * Math.PI / 2); // Cosine/Sine ease-out
                    size = this.baseItemSize + (this.magnification - this.baseItemSize) * smoothFactor;
                }
                
                item.element.style.width = `${size}px`;
                item.element.style.height = `${size}px`;
            });
        };
        
        const handleMouseLeave = () => {
            this.itemElements.forEach(item => {
                item.element.style.width = `${this.baseItemSize}px`;
                item.element.style.height = `${this.baseItemSize}px`;
            });
        };
        
        this.panel.addEventListener('mousemove', handleMouseMove);
        this.panel.addEventListener('mouseleave', handleMouseLeave);
    }
    
    updateLabels(translatorFn) {
        this.items.forEach((item, index) => {
            const el = this.itemElements[index].element;
            const labelEl = el.querySelector('.dock-label');
            if (labelEl && item.translationKey) {
                const newLabel = translatorFn(item.translationKey);
                labelEl.textContent = newLabel;
                el.setAttribute('aria-label', newLabel);
            }
        });
    }
}
window.Dock = Dock;
