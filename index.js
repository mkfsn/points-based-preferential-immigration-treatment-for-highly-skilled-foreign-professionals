class App {
    constructor() {
        this.scoreGroup = [
            'score-education',
            'score-year-experience',
            'score-annual-income',
            'score-age',
            'score-bonus-1',
            'score-bonus-2',
            'score-bonus-3',
            'score-bonus-4',
            'score-bonus-5',
            'score-bonus-6',
            'score-bonus-7',
            'score-bonus-8',
            'score-bonus-9',
            'score-bonus-10',
            'score-bonus-11',
            'score-bonus-12',
            'score-bonus-13',
        ];
    }
    
    initPopovers() {
        $('[data-toggle="popover"]').popover();
    }

    loadSettingsFromHash() {
        const hash = document.location.hash;
        if (!hash) {
            return;
        }
        const data = JSON.parse(atob(hash.replace('#', '')));
        const href = data['nav-item'];
        $(`.nav-pills a[href="${href}"]`).tab('show');
        const table = $(`.tab-pane${href} > table.table`);
        Object.keys(data).map(function(key, index) {
            if (!key.startsWith('score-')) {
                return;
            }
            let value = data[key];
            const el = $(table).find(`.${key}:eq(${value})`);
            el.addClass("selected");
        });
    }

    listenToScoreChanges() {
        const recalculateTotalScore = () => {
            let sum = 0;
            $('[class^="score-"].selected').each(function () {
                sum += parseInt($(this).text(), 10);
            });
            $(this).parents('table.table').find('.total-score').text(sum);
        };
        const takeSnapshot = () => {
            const snapshot = {
                'uuid': this._uuid(),
                'nav-item': $("#myTab").find(".nav-item.active").attr("href"),
            };
            $('[class^="score-"].selected').each(function () {
                const className = $(this).attr('class').split(' ')[0];
                snapshot[className] = $(this).parents("table.table").find(`.${className}`).index(this);
            });
            const encodedString = btoa(JSON.stringify(snapshot));
            history.pushState(null,null,'#'+encodedString);
        };
        this.scoreGroup.forEach(v => {
            $(`.${v}`).on('click', function(){
                const isSelected = $(this).hasClass('selected');
                $(`.${v}`).removeClass('selected');
                // To deselect the selection
                if (!isSelected) {
                    $(this).addClass('selected');
                }
                recalculateTotalScore();
                takeSnapshot();
            });
        });
    }

    _uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

$(() => {
    const app = new App();
    app.initPopovers();
    app.loadSettingsFromHash();
    app.listenToScoreChanges();
});

