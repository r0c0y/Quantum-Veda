// Seed data for QuantumVeda - Videos and Articles
import { storage, STORAGE_KEYS } from '../utils/storage';

export const seedVideos = () => {
    const videos = [
        {
            id: 1702934400000,
            title: "The Dream of Space Exploration",
            url: "https://www.youtube.com/embed/-aGISgOB6n0",
            thumb: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
            date: "Dec 19, 2024",
            isPinned: true,
        },
        {
            id: 1702934300000,
            title: "Journey to the Stars",
            url: "https://www.youtube.com/embed/7X_xMZ2rYXo",
            thumb: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=800",
            date: "Dec 19, 2024",
            isPinned: true,
        },
    ];

    const existing = storage.get(STORAGE_KEYS.VIDEOS) || [];
    if (existing.length === 0) {
        storage.set(STORAGE_KEYS.VIDEOS, videos);
        console.log('✅ Videos seeded successfully!');
    }
};

export const seedArticles = () => {
    const articles = [
        {
            id: 1702934200000,
            title: "Our Vision: Building Dreams in Space",
            excerpt: "From a small team with big dreams to revolutionizing space technology - the journey of QuantumVeda and our mission to make space accessible for everyone.",
            content: `<div class="article-content">
        <p>Every great achievement begins with a dream. For us at <mark style="background-color: #C4E1E1;">QuantumVeda</mark>, that dream was born in a small garage where a group of passionate engineers and dreamers gathered with one audacious goal: <strong>to democratize space exploration</strong>.</p>

        <h2>The Beginning</h2>
        <p>It started with a simple question: <em>"Why should space be accessible only to governments and billion-dollar corporations?"</em> This question ignited a fire that would eventually become QuantumVeda.</p>

        <div class="video-wrapper my-8 relative group" contenteditable="false">
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/-aGISgOB6n0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <h2>Our Mission</h2>
        <p>We believe that <mark style="background-color: #FDF2C0;">space exploration should inspire, educate, and benefit all of humanity</mark>. Our mission is threefold:</p>

        <ul>
          <li><strong>Innovation:</strong> Develop cutting-edge propulsion systems that are efficient and sustainable</li>
          <li><strong>Accessibility:</strong> Make space technology affordable for research institutions and universities</li>
          <li><strong>Education:</strong> Inspire the next generation of space explorers through community engagement</li>
        </ul>

        <h2>The Journey So Far</h2>
        <p>From our first prototype rocket engine tested in 2020 to our upcoming TQV-1 launch, every milestone has been a testament to our team's dedication and the support of our incredible community.</p>

        <blockquote style="border-left: 4px solid #5EEAD4; padding-left: 20px; margin: 30px 0; font-style: italic; color: #666;">
          "The future belongs to those who believe in the beauty of their dreams. At QuantumVeda, we're not just dreaming - we're building that future, one launch at a time."
          <br><br>
          <strong>- Founder, QuantumVeda</strong>
        </blockquote>

        <h2>Our Technology</h2>
        <p>What sets us apart is our <a href="https://quantumveda.space/technology" target="_blank">revolutionary solid-fuel propulsion system</a>. Unlike traditional liquid-fuel rockets, our technology offers:</p>

        <ul>
          <li>✓ <strong>50% cost reduction</strong> in manufacturing</li>
          <li>✓ <strong>Safer handling</strong> and storage</li>
          <li>✓ <strong>Environmentally friendly</strong> combustion</li>
          <li>✓ <strong>Scalable design</strong> for various payload sizes</li>
        </ul>

        <div class="video-wrapper my-8 relative group" contenteditable="false">
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/7X_xMZ2rYXo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <h2>Community & Collaboration</h2>
        <p>We're more than a company - we're a <mark style="background-color: #E1C4E1;">community of dreamers, engineers, scientists, and space enthusiasts</mark>. Join us on:</p>

        <ul>
          <li>🎮 <a href="https://discord.gg/quantumveda" target="_blank">Discord</a> - Daily discussions and updates</li>
          <li>💬 <a href="https://wa.me/quantumveda" target="_blank">WhatsApp</a> - Instant launch notifications</li>
          <li>📧 Newsletter - Weekly research digests and exclusive content</li>
        </ul>

        <h2>The Road Ahead</h2>
        <p>Our upcoming TQV-1 launch is just the beginning. We're working on:</p>

        <ol>
          <li><strong>TQV-2:</strong> Enhanced payload capacity (2025)</li>
          <li><strong>TQV-3:</strong> Reusable rocket technology (2026)</li>
          <li><strong>TQV-Orbital:</strong> First orbital-class vehicle (2027)</li>
        </ol>

        <p><mark style="background-color: #C4E1D0;">The stars are not the limit - they're just the beginning.</mark> Every rocket we build, every test we conduct, and every dream we chase brings us closer to a future where space is accessible to all.</p>

        <h2>Join the Mission</h2>
        <p>Whether you're a student, researcher, investor, or simply someone who looks up at the night sky and wonders "what if?" - there's a place for you in the QuantumVeda family.</p>

        <p><strong>Together, we're not just reaching for the stars - we're building the ladder to get there.</strong></p>

        <p style="text-align: center; margin-top: 40px; font-size: 1.2em; color: #5EEAD4;">
          🚀 <em>Ad Astra Per Aspera</em> - To the Stars Through Difficulties 🚀
        </p>
      </div>`,
            date: "Dec 19, 2024",
            status: "published",
            isPinned: true,
            resources: [
                {
                    id: 1,
                    title: "Company Playlist - Full Journey",
                    url: "https://www.youtube.com/playlist?list=PLIAQh_47wJOHn8uNLkfTCJB6q4Vb40_Fw",
                    type: "video"
                }
            ]
        },
        {
            id: 1702934100000,
            title: "ISRO: India's Remarkable Journey to Space",
            excerpt: "From humble beginnings to Mars missions - explore the incredible history of the Indian Space Research Organisation and its groundbreaking achievements.",
            content: `<div class="article-content">
        <h1>ISRO: The Pride of India's Space Program</h1>
        
        <p>The <strong>Indian Space Research Organisation (ISRO)</strong> stands as a testament to what determination, innovation, and frugal engineering can achieve. From launching satellites on bullock carts to sending missions to Mars and the Moon, ISRO's journey is nothing short of extraordinary.</p>

        <div class="video-wrapper my-8 relative group" contenteditable="false">
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/R7DLwXL6pEQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <h2>The Beginning: 1960s - A Dream Takes Flight</h2>
        
        <p>It all started with <mark style="background-color: #C4E1E1;">Dr. Vikram Sarabhai</mark>, the father of India's space program. In 1962, when India was still a developing nation, Dr. Sarabhai envisioned using space technology for national development.</p>

        <blockquote style="border-left: 4px solid #5EEAD4; padding-left: 20px; margin: 30px 0; font-style: italic; color: #666;">
          "There are some who question the relevance of space activities in a developing nation. To us, there is no ambiguity of purpose. We do not have the fantasy of competing with the economically advanced nations in the exploration of the moon or the planets or manned space-flight. But we are convinced that if we are to play a meaningful role nationally, and in the community of nations, we must be second to none in the application of advanced technologies to the real problems of man and society."
          <br><br>
          <strong>- Dr. Vikram Sarabhai, 1969</strong>
        </blockquote>

        <h2>Humble Beginnings</h2>
        
        <p>The iconic image of <em>rocket parts being transported on a bicycle and bullock cart</em> in Thumba, Kerala, symbolizes ISRO's modest start. The Thumba Equatorial Rocket Launching Station (TERLS) was established in a fishing village, with the local church serving as the initial office.</p>

        <h2>Major Milestones</h2>

        <h3>1. Aryabhata (1975) - India's First Satellite</h3>
        <p>Named after the ancient Indian mathematician, <strong>Aryabhata</strong> was India's first satellite, launched by the Soviet Union. It marked India's entry into the space age.</p>

        <h3>2. SLV-3 (1980) - Indigenous Launch Vehicle</h3>
        <p>Under the leadership of <mark style="background-color: #FDF2C0;">Dr. APJ Abdul Kalam</mark>, India successfully launched its first satellite using an indigenous launch vehicle. The Rohini satellite was placed into orbit, making India the sixth nation to achieve this feat.</p>

        <h3>3. INSAT Series - Communication Revolution</h3>
        <p>The Indian National Satellite System transformed telecommunications, broadcasting, and meteorology across India. Today, INSAT is one of the largest domestic communication satellite systems in the Asia-Pacific region.</p>

        <h3>4. Chandrayaan-1 (2008) - Moon Mission</h3>
        <p><strong>Key Achievement:</strong> Discovery of water molecules on the lunar surface! 🌙</p>
        
        <ul>
          <li>✓ First Indian mission to the Moon</li>
          <li>✓ Confirmed presence of water on lunar surface</li>
          <li>✓ Operated for 312 days</li>
          <li>✓ Cost: ₹386 crores (~$56 million)</li>
        </ul>

        <h3>5. Mars Orbiter Mission - Mangalyaan (2014)</h3>
        <p><mark style="background-color: #E1C4E1;">India became the first nation to reach Mars orbit in its maiden attempt!</mark> Even more impressive - the entire mission cost less than the Hollywood movie "Gravity"!</p>

        <ul>
          <li>🚀 Launch: November 5, 2013</li>
          <li>🔴 Mars Orbit: September 24, 2014</li>
          <li>💰 Cost: ₹450 crores (~$74 million)</li>
          <li>⏱️ Still operational (as of 2022)</li>
        </ul>

        <h3>6. PSLV - The Workhorse</h3>
        <p>The <strong>Polar Satellite Launch Vehicle (PSLV)</strong> is ISRO's most reliable rocket with <mark style="background-color: #C4E1D0;">50+ consecutive successful launches</mark>. It has launched satellites for over 30 countries!</p>

        <p><strong>Record:</strong> In February 2017, PSLV-C37 launched <em>104 satellites in a single mission</em> - a world record! 🎯</p>

        <h3>7. Chandrayaan-2 (2019) - Ambitious Lunar Landing</h3>
        <p>Though the Vikram lander's touchdown didn't go as planned, the orbiter continues to send valuable data. The mission demonstrated India's growing capabilities in deep space exploration.</p>

        <h3>8. Chandrayaan-3 (2023) - Historic Success! 🎉</h3>
        <p><strong>India became the 4th country to soft-land on the Moon and the FIRST to land near the lunar south pole!</strong></p>

        <ul>
          <li>✓ Launch: July 14, 2023</li>
          <li>✓ Landing: August 23, 2023</li>
          <li>✓ Pragyan rover successfully deployed</li>
          <li>✓ Discovered sulfur on lunar surface</li>
          <li>✓ Cost: ₹615 crores (~$75 million)</li>
        </ul>

        <h2>ISRO's Philosophy: Frugal Innovation</h2>

        <p>What makes ISRO truly special is its ability to achieve remarkable results with limited resources. While NASA's Mars mission (MAVEN) cost $671 million, ISRO's Mangalyaan cost just $74 million!</p>

        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Mission</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cost (USD)</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Achievement</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">Chandrayaan-1</td>
            <td style="border: 1px solid #ddd; padding: 12px;">$56 million</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Discovered water on Moon</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px;">Mangalyaan</td>
            <td style="border: 1px solid #ddd; padding: 12px;">$74 million</td>
            <td style="border: 1px solid #ddd; padding: 12px;">First Mars success in maiden attempt</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">Chandrayaan-3</td>
            <td style="border: 1px solid #ddd; padding: 12px;">$75 million</td>
            <td style="border: 1px solid #ddd; padding: 12px;">South pole landing</td>
          </tr>
        </table>

        <h2>Current & Future Missions</h2>

        <h3>Gaganyaan - Human Spaceflight</h3>
        <p>India's first crewed mission is scheduled for 2025. Three Indian astronauts will orbit Earth for 3 days in an indigenously built spacecraft! 🧑‍🚀</p>

        <h3>Aditya-L1 - Sun Mission</h3>
        <p>Launched in September 2023, this mission studies the Sun from the L1 Lagrange point. It's India's first solar observatory! ☀️</p>

        <h3>Shukrayaan-1 - Venus Mission</h3>
        <p>Planned for 2024-2025, this will be India's first mission to Venus, studying its atmosphere and surface.</p>

        <h2>Global Impact</h2>

        <p>ISRO has launched <strong>400+ foreign satellites</strong> from 30+ countries, earning valuable foreign exchange while helping nations access space technology affordably.</p>

        <p><a href="https://www.isro.gov.in" target="_blank">Visit ISRO's official website</a> for the latest updates and mission details.</p>

        <h2>Inspiring the Next Generation</h2>

        <p>ISRO's success story teaches us invaluable lessons:</p>

        <ol>
          <li><strong>Innovation over Resources:</strong> You don't need unlimited budgets to achieve greatness</li>
          <li><strong>Persistence Pays:</strong> Every failure is a stepping stone to success</li>
          <li><strong>Dream Big:</strong> A developing nation can compete with space superpowers</li>
          <li><strong>Teamwork:</strong> Thousands of scientists working towards a common goal</li>
        </ol>

        <blockquote style="border-left: 4px solid #5EEAD4; padding-left: 20px; margin: 30px 0; font-style: italic; color: #666;">
          "Dream is not that which you see while sleeping, it is something that does not let you sleep."
          <br><br>
          <strong>- Dr. APJ Abdul Kalam</strong>
        </blockquote>

        <h2>The Road Ahead</h2>

        <p>With missions to the Moon, Mars, Sun, and Venus, plus the upcoming human spaceflight program, <mark style="background-color: #FDF2C0;">ISRO is poised to become one of the world's leading space agencies</mark>.</p>

        <p>The organization that once transported rockets on bicycles now launches satellites for the world. That's the power of vision, dedication, and scientific excellence! 🇮🇳</p>

        <p style="text-align: center; margin-top: 40px; font-size: 1.2em; color: #5EEAD4;">
          <strong>Jai Hind! Jai Vigyan! 🚀</strong>
        </p>
      </div>`,
            date: "Dec 19, 2024",
            status: "published",
            isPinned: true,
            resources: [
                {
                    id: 1,
                    title: "ISRO Documentary",
                    url: "https://www.youtube.com/watch?v=R7DLwXL6pEQ",
                    type: "video"
                },
                {
                    id: 2,
                    title: "ISRO Official Website",
                    url: "https://www.isro.gov.in",
                    type: "link"
                }
            ]
        }
    ];

    const existing = storage.get(STORAGE_KEYS.ARTICLES) || [];
    if (existing.length === 0) {
        storage.set(STORAGE_KEYS.ARTICLES, articles);
        console.log('✅ Articles seeded successfully!');
    }
};

// Initialize all seed data
export const initializeSeedData = () => {
    seedVideos();
    seedArticles();
    console.log('🎉 All seed data initialized!');
};
