document.addEventListener('DOMContentLoaded', function() {
  console.log('JavaScript loaded successfully');
  const nextWeekButton = document.querySelector('.next-week-button');
  const todayButton = document.querySelector('.btn-today');
  let currentStartDate = new Date(document.querySelector('.week-range').dataset.date);

  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  if (nextWeekButton) {
    nextWeekButton.addEventListener('click', function() {
      const nextWeekStartDate = new Date(currentStartDate);
      nextWeekStartDate.setDate(currentStartDate.getDate() + 7);

      console.log(`Fetching data for the week starting ${nextWeekStartDate.toISOString().split('T')[0]}`);

      fetch(`/reservations?start_date=${nextWeekStartDate.toISOString().split('T')[0]}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        updateCalendar(data);
        currentStartDate = nextWeekStartDate; // Update current start date to the next week's start date
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    });
  } else {
    console.error('Next week button not found');
  }

  if (todayButton) {
    todayButton.addEventListener('click', function() {
      const todayStartDate = new Date();
      console.log(`Fetching data for the week starting ${todayStartDate.toISOString().split('T')[0]}`);

      fetch(`/reservations?start_date=${todayStartDate.toISOString().split('T')[0]}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        updateCalendar(data);
        currentStartDate = todayStartDate; // Update current start date to today's week start date
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    });
  } else {
    console.error('Today button not found');
  }

  function updateCalendar(data) {
    const now = new Date();
    const weekRangeElement = document.querySelector('.week-range');
    const thead = document.querySelector('thead');
    const tbody = document.querySelector('tbody');

    // Update week range display
    weekRangeElement.textContent = `${new Date(data.week_range.begin).toLocaleDateString()} ~ ${new Date(data.week_range.end).toLocaleDateString()}`;
    weekRangeElement.dataset.date = data.week_range.begin; // Update the data-date attribute

    // Update table header
    const headerRow = document.createElement('tr');
    headerRow.classList.add('bg-green', 'border', 'border-gray100', 'h-10');
    const emptyTh = document.createElement('th');
    headerRow.appendChild(emptyTh);

    const startOfWeek = new Date(data.week_range.begin);
    for (let day = 0; day <= 6; day++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(currentDay.getDate() + day);
      const th = document.createElement('th');
      th.classList.add('font-normal', 'text-white', 'bg-green', 'border', 'border-gray100');
      th.textContent = `${currentDay.getMonth() + 1}/${currentDay.getDate()}(${daysOfWeek[currentDay.getDay()]})`;
      headerRow.appendChild(th);
    }

    thead.innerHTML = '';
    thead.appendChild(headerRow);

  // Update table body
  tbody.innerHTML = '';
    for (let hour = 8; hour <= 21; hour++) {
      const row = document.createElement('tr');
      row.classList.add('border', 'border-gray100', 'text-center', 'h-11');
      
      const timeCell = document.createElement('td');
      timeCell.textContent = `${hour}:00`;
      row.appendChild(timeCell);

      for (let day = 0; day <= 6; day++) {
        const currentDay = new Date(data.week_range.begin);
        currentDay.setDate(currentDay.getDate() + day);
        const cell = document.createElement('td');
        cell.classList.add('border', 'border-gray100', 'text-center', 'hover:bg-green');
        
        const reservation = data.reservations.find(r => {
          const startTime = new Date(r.start_time);
          return startTime.getDate() === currentDay.getDate() && startTime.getHours() === hour;
        });

        if (reservation) {
          cell.innerHTML = '<span class="text-red-600">×</span>';
        } else {
          const currentDateTime = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate(), hour);
          if (currentDateTime < now) {
            // Disable past time slots
            cell.classList.add('text-gray');
            cell.innerHTML = '<span class="text-gray">×</span>';
          } else {
            const link = document.createElement('a');
            link.href = `/reservations/new?date=${currentDay.toISOString().split('T')[0]}&time=${hour}`;
            link.classList.add('block', 'text-gray');
            link.textContent = '○';
            cell.appendChild(link);
          }
        }

        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }
  }
});
