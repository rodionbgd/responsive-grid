export default class ResponsiveGrid {
    #tables;

    constructor(selector, cardsPerRow) {
        const container = document.querySelector(selector);
        this.#generateTables(container, cardsPerRow);
        this.#tables = [...container.querySelectorAll('table')];
        // todo remove Timeout
        setTimeout(() => this.#tables?.forEach(table => {
            this.#resizableGrid(table);
            this.#setImageSizes(table);
        }), 500);
    }

    #generateTables(container, cardsPerRow) {
        cardsPerRow?.forEach(cardNumber => {
            const table = document.createElement('table');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            for (let i = 0; i < cardNumber; i += 1) {
                const td = document.createElement('td');
                td.innerHTML = `
                    <div class="card">
                        <div>
                            <div class="img-size" data-id="img-size"></div>
                            <img src="./assets/images/250x250.jpg" alt="bg">
                        </div>
                        <div class="card-details">
                            <div class="card-description">
                                <a href="#" class="card-title" target="_blank">
                                    Three Kingdoms </a>
                                <span class="card-place">
                                    GOP Variete-Theater Essen
                                </span>
                                <span class="card-date">
                                    16 oct
                                </span>
                                <span class="card-date">
                                    from 2200 ₽
                                </span>
                            </div>
                            <div class="card-price">
                                <a href="#"
                                   target="_blank">
                                    <span>
                                        buy
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    `;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            table.appendChild(tbody);
            container.appendChild(table);
        });
    }

    #setImageSizes(table) {
        const allImages = [...table.querySelectorAll('img')];
        const allImageSizes = [...table.querySelectorAll('.img-size')];
        allImages.forEach((image, i) => {
            allImageSizes[i].innerHTML = `${image.clientWidth}x${image.clientHeight}`;
        });
    }

    #resizableGrid(table) {
        const [row] = table.getElementsByTagName('tr');
        const cols = row ? row.children : undefined;
        if (!cols) {
            return;
        }

        table.style.overflow = 'hidden';

        [...cols].forEach(col => {
            const divs = this.#createDivs();
            divs?.forEach(div => {
                col.appendChild(div);
                this.#setListeners(div);
            });
            col.style.position = 'relative';
        });
    }

    #setListeners(div) {
        let pageX;
        let pageY;
        let curCol;
        let curColWidth;
        let colHeight;
        let curRow;
        let curRowCols;
        let images;
        let curImg;
        let imgSizes;
        div.addEventListener('mousedown', onMousedown.bind(this));

        function onMousedown(e) {
            curCol = e.target.parentElement;
            [curImg] = curCol.getElementsByTagName('img');
            curImg.style.opacity = '.8';
            pageX = e.pageX;
            pageY = e.pageY;
            curRow = curCol?.parentElement;
            images = [...curRow.getElementsByTagName('img')];
            imgSizes = [...curRow.querySelectorAll('.img-size')];

            if (curRow?.tagName === 'TR') {
                curRowCols = curRow.children;
            }
            const padding = this.#paddingDiff(curCol);

            curColWidth = curCol.offsetWidth - padding;
            colHeight = curCol.offsetHeight - padding;
        }

        div.addEventListener('mouseout', e => {
            e.target.style.borderRight = '';
        });

        document.addEventListener('mousemove', (e) => {
            if (!curCol) {
                return;
            }
            const diffX = e.pageX - pageX;
            const diffY = e.pageY - pageY;
            images.forEach((image, i) => {
                imgSizes[i].innerHTML = `${image.clientWidth}x${image.clientHeight}`;
            });
            if (curRowCols) {
                [...curRowCols].forEach(col => {
                    col.style.height = (colHeight + diffY) + 'px';
                });
            }
            curCol.style.width = (curColWidth + diffX) + 'px';
        });

        document.addEventListener('mouseup', () => {
            curCol = undefined;
            pageX = undefined;
            curColWidth = undefined;
            if (curImg) {
                curImg.style.opacity = '1';
            }
        });
    }

    #createBaseDiv() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.cursor = 'nwse-resize';
        div.style.userSelect = 'none';
        return div;
    }

    #createDivs() {
        const divSize = 15;
        const divV = this.#createBaseDiv();
        divV.style.top = '0';
        divV.style.right = '0';
        divV.style.width = `${divSize}px`;
        divV.style.height = '100%';

        const divH = this.#createBaseDiv();
        divH.style.bottom = '0';
        divH.style.left = '0';
        divH.style.width = '100%';
        divH.style.height = `${divSize}px`;

        return [divH, divV];
    }

    #paddingDiff(col) {
        if (this.#getStyleVal(col, 'box-sizing') === 'border-box') {
            return 0;
        }
        const padLeft = this.#getStyleVal(col, 'padding-left');
        const padRight = this.#getStyleVal(col, 'padding-right');
        return parseInt(padLeft) + parseInt(padRight);
    }

    #getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
    }
}