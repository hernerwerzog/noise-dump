document.addEventListener('DOMContentLoaded', async () => {
    const url = 'https://api.github.com/repos/hernerwerzog/noise-dump/contents/data/gigs.json';
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const jsonData = await response.json();

        const contentDiv = document.getElementById('content');

        jsonData.forEach(articleData => {
            const article = document.createElement('article');
            article.className = 'box post post-excerpt';

            const header = document.createElement('header');
            header.className = 'header';

            const headerTop = document.createElement('div');
            headerTop.className = 'header-top';

            const dateBox = document.createElement('div');
            dateBox.className = 'date-box';

            const dateParts = articleData.date.split(', ');
            const datePart1 = dateParts[0]; // "Feb 3"
            const datePart2 = dateParts[1]; // "2025"

            const datePart1Elem = document.createElement('div');
            datePart1Elem.className = 'date-part1';
            datePart1Elem.textContent = datePart1;

            const datePart2Elem = document.createElement('div');
            datePart2Elem.className = 'date-part2';
            datePart2Elem.textContent = datePart2;

            dateBox.appendChild(datePart1Elem);
            dateBox.appendChild(datePart2Elem);

            const headerText = document.createElement('div');
            headerText.className = 'header-text';

            const h1 = document.createElement('h1');
            h1.textContent = articleData.title;

            const h2 = document.createElement('h2');
            h2.textContent = articleData.subtitle;

            headerText.appendChild(h1);
            headerText.appendChild(h2);

            headerTop.appendChild(dateBox);
            headerTop.appendChild(headerText);
            header.appendChild(headerTop);

            const info = document.createElement('div');
            info.className = 'info';

            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';

            const iframe = document.createElement('iframe');
            iframe.width = '800';
            iframe.height = '450';
            iframe.src = articleData.videoUrl;
            iframe.title = 'YouTube video player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            videoContainer.appendChild(iframe);

            const pDescription = document.createElement('p');
            pDescription.className = 'description';
            pDescription.innerHTML = `${articleData.description}`;

            const pLocation = document.createElement('p');
            pLocation.className = 'location';
            pLocation.innerHTML = `${articleData.location}`;

            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-container';

            const ticketsLink = document.createElement('a');
            ticketsLink.href = articleData.ticketsUrl;
            ticketsLink.className = 'ticket-icon';
            ticketsLink.innerHTML = `<i class="fa-solid fa-ticket fa-lg" style="color: #ff69b4;"></i>`;

            const calendarButton = document.createElement('button');
            calendarButton.className = 'calendar-button';
            calendarButton.innerHTML = `<i class="fa-regular fa-calendar-days fa-lg"></i>`;
            calendarButton.id = `calendar-button-${articleData.title.replace(/\s+/g, '-')}`;

            const config = {
                name: articleData.title,
                description: articleData.description,
                startDate: formatDate(articleData.date),
                endDate: formatDate(articleData.endDate),
                startTime: articleData.startTime,
                endTime: articleData.endTime,
                options: ["Google", "iCal"],
                timeZone: "Europe/London"
            };

            calendarButton.addEventListener('click', () => atcb_action(config, calendarButton));

            iconContainer.appendChild(ticketsLink);
            iconContainer.appendChild(calendarButton);

            article.appendChild(header);
            article.appendChild(info);
            article.appendChild(videoContainer);
            article.appendChild(pDescription);
            article.appendChild(pLocation);
            article.appendChild(iconContainer);

            contentDiv.appendChild(article);
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});

function formatDate(dateStr) {
    const [month, day, year] = dateStr.split(' ');
    const monthMap = {
        JAN: '01',
        FEB: '02',
        MAR: '03',
        APR: '04',
        MAY: '05',
        JUN: '06',
        JUL: '07',
        AUG: '08',
        SEP: '09',
        OCT: '10',
        NOV: '11',
        DEC: '12'
    };
    return `${year}-${monthMap[month.toUpperCase()]}-${day.replace(',', '')}`;
}
