import os
import base64
import subprocess

# Paths
assets_dir = "/Users/sunnykumar/portfolio/PixelForge/public"
profile_img_path = os.path.join(assets_dir, "profile.jpg")
html_path = os.path.join(assets_dir, "resume_temp.html")
pdf_path = os.path.join(assets_dir, "Sunny_Kumar_Resume.pdf")

# Base64 encode profile image
with open(profile_img_path, "rb") as f:
    img_base64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sunny Kumar - Resume</title>
  <style>
    @page {{
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
      font-size: 13px;
    }}
    .header {{
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid #06b6d4;
    }}
    .profile-img {{
      width: 105px;
      height: 140px;
      border-radius: 12px;
      object-fit: cover;
      object-position: top;
      border: 2px solid #06b6d4;
    }}
    .header-info {{
      flex: 1;
    }}
    .name {{
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }}
    .title {{
      font-size: 14px;
      font-weight: 700;
      color: #0891b2;
      margin-top: 2px;
    }}
    .contact-bar {{
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
      font-size: 12px;
      color: #475569;
    }}
    .contact-item {{
      display: flex;
      align-items: center;
      gap: 4px;
    }}
    .contact-item strong {{
      color: #0f172a;
    }}
    .section {{
      margin-top: 16px;
    }}
    .section-title {{
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0891b2;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 8px;
    }}
    .summary-text {{
      color: #334155;
      font-size: 12.5px;
      line-height: 1.6;
    }}
    .grid-2 {{
      display: flex;
      gap: 16px;
    }}
    .col {{
      flex: 1;
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }}
    .col-title {{
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      font-size: 13px;
    }}
    .skill-list {{
      color: #475569;
      font-size: 12px;
      line-height: 1.5;
    }}
    .project-item {{
      margin-bottom: 10px;
    }}
    .project-header {{
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      color: #0f172a;
    }}
    .project-date {{
      color: #0891b2;
      font-size: 11px;
    }}
    .project-desc {{
      color: #475569;
      font-size: 12px;
      margin-top: 2px;
    }}
    .education-item {{
      color: #334155;
    }}
    .edu-title {{
      font-weight: 700;
      color: #0f172a;
    }}
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <img src="data:image/jpeg;base64,{img_base64}" class="profile-img" alt="Sunny Kumar">
    <div class="header-info">
      <div class="name">Sunny Kumar</div>
      <div class="title">Full-Stack Web Developer & Professional Video Editor</div>
      <div class="contact-bar">
        <div class="contact-item"><strong>Email:</strong> sunnykumar6207058974@gmail.com</div>
        <div class="contact-item"><strong>Phone:</strong> +91 8340112045</div>
        <div class="contact-item"><strong>Location:</strong> India</div>
      </div>
    </div>
  </div>

  <!-- Summary -->
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary-text">
      Passionate and versatile Full-Stack Web Developer and Video Editor with a strong foundation in building modern, high-performance web applications and crafting engaging visual media. Skilled in React.js, Node.js, Tailwind CSS, and creative video editing to deliver impactful digital products and seamless user experiences.
    </div>
  </div>

  <!-- Skills -->
  <div class="section">
    <div class="section-title">Technical & Creative Skills</div>
    <div class="grid-2">
      <div class="col">
        <div class="col-title">💻 Web Development Stack</div>
        <div class="skill-list">
          React.js, JavaScript (ES6+), Node.js, Express.js, Tailwind CSS, HTML5, CSS3, REST APIs, MongoDB, Git & GitHub, Vercel, Vite.
        </div>
      </div>
      <div class="col">
        <div class="col-title">🎬 Video Editing & Media</div>
        <div class="skill-list">
          Video Cutting & Trimming, Motion Graphics, Audio Synchronization, Color Grading, Storyboarding, Social Media Clips & Promo Videos.
        </div>
      </div>
    </div>
  </div>

  <!-- Projects -->
  <div class="section">
    <div class="section-title">Featured Projects</div>

    <div class="project-item">
      <div class="project-header">
        <span>1. Cartify - Premium E-Commerce Shopping Platform</span>
        <span class="project-date">2026</span>
      </div>
      <div class="project-desc">
        Built a full-stack e-commerce platform with product category management, interactive shopping cart, dark mode toggle, and instant dispatch tracking.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <span>2. UrbanThread - Luxe Sneakers & Streetwear Drops</span>
        <span class="project-date">2026</span>
      </div>
      <div class="project-desc">
        Developed a high-end streetwear e-commerce platform featuring sneaker drops, flash deal banners, promo code engine, wishlist, and admin analytics dashboard.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <span>3. PixelForge - Developer Portfolio & Digital Showcase</span>
        <span class="project-date">2026</span>
      </div>
      <div class="project-desc">
        Created an interactive developer portfolio featuring an HTML5 canvas particle background, theme switching context, video demo popups, custom cursor, and printable resume viewer.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <span>4. Aetheria - Immersive WebGL 3D Matrix Experience</span>
        <span class="project-date">2026</span>
      </div>
      <div class="project-desc">
        Architected a 3D WebGL digital experience with 60 FPS matrix torus particles, audio sound FX, zero-trust API security, and ultra-fast sub-second loading speeds.
      </div>
    </div>
  </div>

  <!-- Education -->
  <div class="section">
    <div class="section-title">Education</div>
    <div class="education-item">
      <div class="edu-title">B.Tech in Computer Science & Engineering</div>
      <div class="summary-text" style="font-size: 11.5px; color: #64748b;">
        Focused on Web Application Development, Database Management Systems, Software Architecture, and Visual Digital Media.
      </div>
    </div>
  </div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

# Run Chrome Headless to compile HTML to PDF
chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    html_path
]

subprocess.run(chrome_cmd, check=True)
print("PDF compiled successfully at:", pdf_path)
