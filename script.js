
$(document).ready(function() {
    $('#currentDay').text(dayjs().format('dddd, MMMM D, YYYY'));
    populateDaySelector();
    populateMonthSelector();
    renderTimeBlocks(dayjs().format('YYYY-MM-DD'));
    displaySavedDays();
    $('#daySelector').val(dayjs().date()).change();
});

function populateDaySelector() {
    for (let i = 1; i <= dayjs().daysInMonth(); i++) {
        $('#daySelector').append(`<option value="${i}">${i}</option>`);
    }
    $('#daySelector').change(function() {
        const selectedYear = dayjs().year(); 
        const selectedMonth = parseInt($('#monthSelector').val());
        const selectedDay = parseInt($('#daySelector').val());
        const selectedDate = dayjs(new Date(selectedYear, selectedMonth, selectedDay)).format('YYYY-MM-DD');
        console.log("Selected date:", selectedDate);
        renderTimeBlocks(selectedDate);
    });
}

function renderTimeBlocks(selectedDate) {
    $('#timeBlocks').empty(); // Clear existing time blocks

    for (let hour = 0; hour < 24; hour++) { // Loop from 12 AM to 12 AM
        let timeBlockClass = 'future'; // Default class
        if (dayjs().format('YYYY-MM-DD') === selectedDate) {
            if (hour < dayjs().hour()) {
                timeBlockClass = 'past';
            } else if (hour === dayjs().hour()) {
                timeBlockClass = 'present';
            }
        }

        let timeBlock = $('<div>').addClass(`row time-block ${timeBlockClass}`).attr('id', `hour-${hour}`);
        let timeLabel = $('<div>').addClass('col-2 col-md-1 hour text-center py-3').text(dayjs().hour(hour).format('h A'));
        let eventInput = $('<textarea>').addClass('col-8 col-md-10 description').attr('rows', '3');
        let saveButton = $('<button>').addClass('btn saveBtn col-2 col-md-1').attr('aria-label', 'save').html('<i class="fas fa-save" aria-hidden="true"></i>');

        // Add event listener to save button
        saveButton.click(function() {
            let eventText = $(this).siblings('.description').val(); // Adjusted to target the textarea
            saveEvent(selectedDate, hour, eventText);
        });

        timeBlock.append(timeLabel, eventInput, saveButton);
        $('#timeBlocks').append(timeBlock);

        // Load any saved events
        let savedEvent = localStorage.getItem(selectedDate + '-' + hour);
        if (savedEvent) {
            eventInput.val(savedEvent);
        }
    }
}


function displaySavedDays() {
    const savedDaysContainer = $('#savedDays');
    savedDaysContainer.empty(); 
    let uniqueDates = new Set();

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log("localStorage key:", key);
        let date = key.split('-').slice(0, 3).join('-');
        console.log("Extracted date:", date);
        uniqueDates.add(date);
    }

    console.log("Unique dates:", uniqueDates);

    uniqueDates.forEach(date => {
        let dayElement = $('<div>').addClass('saved-day').text(date);
        dayElement.click(() => {
            // Reload the page with this day's schedule
            let dayOfMonth = dayjs(date).date();
            $('#daySelector').val(dayOfMonth).change(); // Trigger change to reload schedule
        });
        savedDaysContainer.append(dayElement);
    });
}

function populateMonthSelector() {
    $('#monthSelector').empty();
    for (let i = 0; i < 12; i++) {
        $('#monthSelector').append(`<option value="${i}">${dayjs().month(i).format('MMMM')}</option>`);
    }
    $('#monthSelector').val(dayjs().month());

    $('#monthSelector').change(function() {
        const selectedMonth = parseInt($('#monthSelector').val());
        const selectedYear = dayjs().year();
        const daysInMonth = dayjs(new Date(dayjs().year(), selectedMonth)).daysInMonth();
        $('#daySelector').empty(); 
        for (let i = 1; i <= daysInMonth; i++) {
            $('#daySelector').append(`<option value="${i}">${i}</option>`);
        }
    
       $('#daySelector').val(1);
    
        let selectedDate = dayjs(new Date(selectedYear, selectedMonth, 1)).format('YYYY-MM-DD');
        renderTimeBlocks(selectedDate);
        
        displaySavedDays();
    });
    
}

function saveEvent(date, hour, text) {
    localStorage.setItem(date + '-' + hour, text);
    displaySavedDays()
}

$('#monthSelector').change(function() {
    updateDaySelector(); 
    updateScheduler(); 
});

$('#daySelector').change(function() {
    updateScheduler(); 
});

function updateDaySelector() {
    const selectedMonth = parseInt($('#monthSelector').val());
    const daysInMonth = dayjs(new Date(dayjs().year(), selectedMonth)).daysInMonth();
    $('#daySelector').empty();
    for (let i = 1; i <= daysInMonth; i++) {
        $('#daySelector').append(`<option value="${i}">${i}</option>`);
    }
}

function updateScheduler() {
    const selectedYear = dayjs().year();
    const selectedMonth = parseInt($('#monthSelector').val());
    const selectedDay = parseInt($('#daySelector').val());
    const selectedDate = dayjs(new Date(selectedYear, selectedMonth, selectedDay)).format('YYYY-MM-DD');
    renderTimeBlocks(selectedDate);
}

