document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.getElementById('content');

    // Function to render gigs or archive data
    function renderData(data, isArchive = false) {
        contentDiv.innerHTML = ''; // Clear existing content
        data.forEach(gig => {
            const article = document.createElement('article');
            article.className = 'box post post-excerpt';

            const header = document.createElement('header');
            header.className = 'header';

            const headerTop = document.createElement('div');
            headerTop.className = 'header-top';

            const dateBox = document.createElement('div');
            dateBox.className = 'date-box';

            const dateParts = gig.date.split(', ');
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
            h1.textContent = gig.title;

            const h2 = document.createElement('h2');
            h2.textContent = gig.subtitle;

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
            iframe.src = gig.videoUrl;
            iframe.title = 'YouTube video player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            videoContainer.appendChild(iframe);

            const pDescription = document.createElement('p');
            pDescription.className = 'description';
            pDescription.innerHTML = `${gig.description}`;

            const pLocation = document.createElement('p');
            pLocation.className = 'location';
            pLocation.innerHTML = `${gig.location}`;

            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-container';

            if (!isArchive) {
                const ticketsLink = document.createElement('a');
                ticketsLink.href = gig.ticketsUrl;
                ticketsLink.className = 'ticket-icon';
                ticketsLink.innerHTML = `<i class="fa-solid fa-ticket fa-lg" style="color: #ff69b4;"></i>`;

                const calendarButton = document.createElement('button');
                calendarButton.className = 'calendar-button';
                calendarButton.innerHTML = `<i class="fa-regular fa-calendar-days fa-lg"></i>`;
                calendarButton.id = `calendar-button-${gig.title.replace(/\s+/g, '-')}`;

                const config = {
                    name: gig.title,
                    description: gig.description,
                    location: gig.location,
                    startDate: formatDate(gig.date),
                    endDate: formatDate(gig.endDate),
                    startTime: gig.startTime,
                    endTime: gig.endTime,
                    options: ["Google", "iCal"],
                    timeZone: "Europe/London"
                };

                calendarButton.addEventListener('click', () => atcb_action(config, calendarButton));

                iconContainer.appendChild(ticketsLink);
                iconContainer.appendChild(calendarButton);
            }

            article.appendChild(header);
            article.appendChild(info);
            article.appendChild(videoContainer);
            article.appendChild(pDescription);
            article.appendChild(pLocation);
            article.appendChild(iconContainer);

            contentDiv.appendChild(article);
        });
    }

    // Fetch and render gigs data on page load
    async function loadGigs() {
        try {
            const response = await fetch('data/gigs.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const gigsData = await response.json();
            renderData(gigsData);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Load gigs data on page load
    loadGigs();

    // Add event listener for the "GIGS" link
    const gigsLink = document.querySelector('a[href="#gigs"]');
    if (gigsLink) {
        console.log('Gigs link found');
        gigsLink.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Gigs link clicked');
            loadGigs();
        });
    } else {
        console.error('Gigs link not found');
    }

    // Add event listener for the "ARCHIVE" link
    const archiveLink = document.getElementById('archive-link');
    if (archiveLink) {
        console.log('Archive link found');
        archiveLink.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Archive link clicked');
            fetch('data/archive.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Archive data fetched', data);
                    renderData(data, true);
                })
                .catch(error => console.error('Error fetching archive data:', error));
        });
    } else {
        console.error('Archive link not found');
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