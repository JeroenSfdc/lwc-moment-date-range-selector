import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import moment from '@salesforce/resourceUrl/momentJS';

const columns = [
    { label: 'Period', fieldName: 'period', type: 'text' },
    { label: 'Start', fieldName: 'startDisplay', type: 'text' },
    { label: 'End', fieldName: 'endDisplay', type: 'text' }
];

export default class DatePickerLwc extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track backingData = []; // used to undo filter
    @track selectedStartDate;
    @track selectedEndDate;

    async connectedCallback () {

        Promise.all([
            loadScript(this, moment + '/moment-with-locales.min.js')
        ])
        .then(() => {
            this.calculatePeriods();
        })
        .catch(() => {
            console.log("Couldn't initialize momentJS.");
        });
    }

    calculatePeriods() {
        let periods = [];
        // format for display when calling format()
        const formatDisplay = 'MMMM Do YYYY';
        // default format when calling format()
        self.moment.defaultFormat = 'YYYY-MM-DD';

        // key dates 
        const today         = self.moment();
        const startCurrY    = self.moment().startOf('year');
        const endCurrY      = self.moment().endOf('year');
        const startPrevY    = self.moment().subtract(1, 'year').startOf('year');
        const endPrevY      = self.moment().subtract(1, 'year').endOf('year');
        const startCurrQ    = self.moment().startOf('quarter');
        const endCurrQ      = self.moment().endOf('quarter');
        const startPrevQ    = self.moment().subtract(1, 'quarter').startOf('quarter');
        const endPrevQ      = self.moment().subtract(1, 'quarter').endOf('quarter');
        const startCurrM    = self.moment().startOf('month');
        const endCurrM      = self.moment().endOf('month');
        const startPrevM    = self.moment().subtract(1, 'month').startOf('month');
        const endPrevM      = self.moment().subtract(1, 'month').endOf('month');

        // Previous Year
        periods.push({period: 'Last Year', startDisplay: startPrevY.format(formatDisplay), endDisplay: endPrevY.format(formatDisplay)
                        , start: startPrevY.format(), end: endPrevY.format()});
        // Current Year
        periods.push({period: 'This Year', startDisplay: startCurrY.format(formatDisplay), endDisplay: endCurrY.format(formatDisplay)
                        , start: startCurrY.format(), end: endCurrY.format()});
        // Year-to-date
        periods.push({period: 'Year-to-date', startDisplay: startCurrY.format(formatDisplay), endDisplay: today.format(formatDisplay)
                        , start: startCurrY.format(), end: today.format()});
        // Previous Quarter
        periods.push({period: 'Last Quarter', startDisplay: startPrevQ.format(formatDisplay), endDisplay: endPrevQ.format(formatDisplay)
                        , start: startPrevQ.format(), end: endPrevQ.format()});
        // Current Quarter
        periods.push({period: 'This Quarter', startDisplay: startCurrQ.format(formatDisplay), endDisplay: endCurrQ.format(formatDisplay)
                        , start: startCurrQ.format(), end: endCurrQ.format()});
        // Quater-to-date
        periods.push({period: 'Quarter-to-date', startDisplay: startCurrQ.format(formatDisplay), endDisplay: today.format(formatDisplay)
                        , start: startCurrQ.format(), end: today.format()});
        // Previous Month
        periods.push({period: 'Last Month', startDisplay: startPrevM.format(formatDisplay), endDisplay: endPrevM.format(formatDisplay)
                        , start: startPrevM.format(), end: endPrevM.format()});
        // Current Month
        periods.push({period: 'This Month', startDisplay: startCurrM.format(formatDisplay), endDisplay: endCurrM.format(formatDisplay)
                        , start: startCurrM.format(), end: endCurrM.format()});
        // Month-to-date
        periods.push({period: 'Month-to-date', startDisplay: startCurrM.format(formatDisplay), endDisplay: today.format(formatDisplay)
                        , start: startCurrM.format(), end: today.format()});

        // push data into lightning-data-table
        this.data = periods;
        this.backingData = periods;
    }

    handleSelect(evt) {
        const selectedRows = evt.detail.selectedRows;
        this.selectedStartDate = selectedRows[0].start;
        this.selectedEndDate = selectedRows[0].end;
    }

    handleSearch(evt) {
        const term = evt.target.value;
        const data = this.backingData;
        let results, regex;

        try {
            regex = new RegExp(term, "i");
            results = data.filter(row => regex.test(JSON.stringify(row)));
        }
        catch (e) {
            // invalid regex, use full list
        }
        
        this.data = results;
    }
}