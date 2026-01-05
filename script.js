// Initialize views counter using CounterAPI.dev
let viewCount = 0;

// Display counter with leading zeros
function updateCounter(count) {
    const counterElement = document.getElementById('viewCounter');
    counterElement.textContent = String(count).padStart(6, '0');
}

// Fetch and increment counter from CounterAPI.dev
async function initCounter() {
    try {
        const response = await fetch('https://api.counterapi.dev/v1/ivan/sipsariya-free/up');
        const data = await response.json();
        viewCount = data.count;
        updateCounter(viewCount);
    } catch (error) {
        console.error('Error fetching counter:', error);
        // Fallback to localStorage if API fails
        viewCount = parseInt(localStorage.getItem('viewCount')) || 0;
        viewCount++;
        localStorage.setItem('viewCount', viewCount);
        updateCounter(viewCount);
    }
}

// Load video data
let videoData = {};

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        videoData = data;
        console.log('Video data loaded successfully');
    })
    .catch(error => {
        console.error('Error loading video data:', error);
        document.getElementById('videoList').innerHTML = 
            '<div class="placeholder">👆 Please select a month from the dropdown above</div>';
    });

// Load videos based on selected month
function loadVideos() {
    const monthSelect = document.getElementById('monthSelect');
    const videoList = document.getElementById('videoList');
    const selectedMonth = monthSelect.value;
    
    if (!selectedMonth) {
        videoList.innerHTML = '<div class="placeholder">👆 Please select a month from the dropdown above</div>';
        return;
    }
    
    const videos = videoData[selectedMonth];
    
    if (!videos || videos.length === 0) {
        videoList.innerHTML = '<div class="placeholder">No videos found for this month</div>';
        return;
    }
    
    // Add notice for December
    let html = '';
    if (selectedMonth === 'december') {
        html += `
            <div class="notice-box">
                ⚠️ <strong>Notice:</strong> දෙසැම්බර් මාසයට අදාළ ඇතැම් recordings sipsariya.lk වෙබ් අඩවියට නිකුත් කර නැති බැවින් මෙහි ඉදිරිපත් කිරීමට නොහැක.
            </div>
        `;
    }
    // if (selectedMonth === 'january') {
    //     html += `
    //         <div class="notice-box">
    //             ⚠️ <strong>Notice:</strong> ජනවාරි මාසයට අදාළ recordings sipsariya.lk වෙබ් අඩවියට නිකුත් කර නැති බැවින් මෙහි ඉදිරිපත් කිරීමට නොහැක.
    //         </div>
    //     `;
    // }
    
    // Build video list HTML
    videos.forEach(video => {
        // Determine if it's a Zoom link (long ID) or YouTube (short ID)
        const isZoom = video.videoId.length > 20;
        const videoUrl = isZoom 
            ? `https://zoom.us/rec/share/${video.videoId}`
            : `https://www.youtube.com/watch?v=${video.videoId}`;
        const buttonText = isZoom ? '▶ WATCH ON ZOOM' : '▶ WATCH ON YT';
        
        html += `
            <div class="video-item">
                <div class="video-info">
                    <div class="video-date">${video.date}</div>
                    <div class="video-title">${video.title}</div>
                </div>
                <a href="${videoUrl}" 
                   target="_blank" 
                   class="yt-button">
                    ${buttonText}
                </a>
            </div>
        `;
    });
    
    videoList.innerHTML = html;
}

// Animate counter on load
window.addEventListener('load', async () => {
    // Reset dropdown to default
    document.getElementById('monthSelect').value = '';
    
    await initCounter();
    
    // Optional: Add a retro animation effect
    let currentCount = 0;
    const targetCount = viewCount;
    const counterElement = document.getElementById('viewCounter');
    
    const interval = setInterval(() => {
        if (currentCount < targetCount) {
            currentCount++;
            counterElement.textContent = String(currentCount).padStart(6, '0');
        } else {
            clearInterval(interval);
        }
    }, 10);
});
