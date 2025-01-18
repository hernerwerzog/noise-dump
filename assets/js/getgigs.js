document.addEventListener('DOMContentLoaded', async () => {
    const url = 'https://api.github.com/repos/hernerwerzog/noise-dump/data/gigs.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const content = atob(data.content); // Decode base64 content
        const jsonData = JSON.parse(content);

        // Example JSON structure
        // [
        //     {
        //         "title": "Slomosa",
        //         "subtitle": "MANCHESTER",
        //         "date": "Feb 3, 2025",
        //         "comments": 16,
        //         "hearts": 32,
        //         "twitter": 64,
        //         "facebook": 128,
        //         "videoUrl": "https://www.youtube.com/embed/TK-GClrSOGo?si=pahCizKiIxDQVgt4",
        //         "description": "Stoner/Desert Rock<br>Rebellion, Manchester, UK",
        //         "ticketsUrl": "https://www.fatsoma.com/e/51ta81gx/slomosa"
        //     },
        //     ...
        // ]

        const contentDiv = document.getElementById('content');

        jsonData.forEach(articleData => {
            const article = document.createElement('article');
            article.className = 'box post post-excerpt';

            const header = document.createElement('header');
            const h2 = document.createElement('h2');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = articleData.title;
            h2.appendChild(a);
            const pSubtitle = document.createElement('p');
            pSubtitle.textContent = articleData.subtitle;
            header.appendChild(h2);
            header.appendChild(pSubtitle);

            const info = document.createElement('div');
            info.className = 'info';
            const spanDate = document.createElement('span');
            spanDate.className = 'date';
            spanDate.innerHTML = `<span class="month">${articleData.date.split(' ')[0]}<span>${articleData.date.split(' ')[0].slice(3)}</span></span> <span class="day">${articleData.date.split(' ')[1].replace(',', '')}</span><span class="year">, ${articleData.date.split(' ')[2]}</span>`;
            const ulStats = document.createElement('ul');
            ulStats.className = 'stats';
            ulStats.innerHTML = `
                <li><a href="#" class="icon fa-comment">${articleData.comments}</a></li>
                <li><a href="#" class="icon fa-heart">${articleData.hearts}</a></li>
                <li><a href="#" class="icon brands fa-twitter">${articleData.twitter}</a></li>
                <li><a href="#" class="icon brands fa-facebook-f">${articleData.facebook}</a></li>
            `;
            info.appendChild(spanDate);
            info.appendChild(ulStats);

            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = articleData.videoUrl;
            iframe.title = 'YouTube video player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            const pDescription = document.createElement('p');
            pDescription.innerHTML = `${articleData.description}<br><a href="${articleData.ticketsUrl}"><strong>Tickets</strong></a>`;

            article.appendChild(header);
            article.appendChild(info);
            article.appendChild(iframe);
            article.appendChild(pDescription);

            contentDiv.appendChild(article);
        });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
});
