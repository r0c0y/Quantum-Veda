# 📚 QuantumVeda Admin Dashboard - Complete Manual

## 🎯 **Welcome to the Admin Dashboard!**

This manual will guide you through every feature of the QuantumVeda Admin Dashboard.

---

## 🔐 **1. Logging In**

### **Access URL:**
```
https://your-domain.com/admin-tqv-control
```

### **Credentials:**
- **Username:** `tqv_admin`
- **Password:** `rocket2025`

### **Steps:**
1. Navigate to `/admin-tqv-control`
2. Enter username and password
3. Click "Login"
4. You're in! 🎉

---

## 📊 **2. Dashboard Overview**

After logging in, you'll see three main tabs:

### **📝 Articles Tab**
- View all published articles
- Create new articles
- Edit existing articles
- Delete articles
- Pin/unpin articles

### **🎥 Videos Tab**
- View all videos
- Add new videos
- Edit video details
- Delete videos
- Pin/unpin videos

### **📧 Newsletter Tab**
- View all email subscribers
- See subscription dates
- Export subscriber list

---

## ✍️ **3. Creating Articles**

### **Step-by-Step:**

1. **Click "Create New Article"** button
2. **Fill in the details:**
   - **Title:** Article headline
   - **Excerpt:** Short description (shows in preview)
   - **Content:** Full article (use rich editor)

3. **Use the Editor Toolbar:**

#### **Text Formatting:**
- **Bold** - Click B or Ctrl+B
- **Italic** - Click I or Ctrl+I
- **Underline** - Click U or Ctrl+U

#### **Headings:**
- **H1** - Main title
- **H2** - Section headers
- **H3** - Sub-sections

#### **Highlighting:**
Click the highlighter icon, choose color:
- 🟦 Light Teal
- 🟪 Light Purple
- 🟨 Light Yellow
- 🟩 Light Green

#### **Links:**
1. Select text
2. Click link icon
3. Enter URL
4. Click "Insert Link"

#### **Images:**
1. Click "Image" button
2. Select image file
3. Image is automatically compressed!
4. Inserted into article

**Note:** Images are compressed to 60-80% smaller size automatically!

#### **Videos:**
1. Click "Video" button
2. Enter YouTube URL
3. Video embedded automatically

**Supported formats:**
- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID`

#### **Documents:**
1. Click "Document" button
2. Select PDF, Word, or TXT file
3. Document embedded as download card

#### **Lists:**
- Click bullet list for unordered lists
- Click numbered list for ordered lists

#### **Line Numbers:**
- Toggle to show/hide line numbers
- Useful for code snippets

4. **Add Resources (Optional):**
   - Click "Resources" button
   - Enter resource title
   - Enter resource URL
   - Click "Add Resource"
   - Resources appear at bottom of article

5. **Set Status:**
   - **Published** - Visible to everyone
   - **Draft** - Only visible in admin

6. **Pin Article (Optional):**
   - Check "Pin this article"
   - Pinned articles appear first

7. **Click "Save Article"**

---

## 🎬 **4. Managing Videos**

### **Adding a Video:**

1. **Click "Add Video"** button
2. **Fill in details:**
   - **Title:** Video name
   - **URL:** YouTube video URL
   - **Thumbnail:** Image URL (optional)
   - **Date:** Publication date

3. **Pin Video (Optional):**
   - Check "Pin this video"
   - Pinned videos appear first

4. **Click "Save"**

### **Editing a Video:**

1. Find video in list
2. Click "Edit"
3. Update details
4. Click "Save"

### **Deleting a Video:**

1. Find video in list
2. Click "Delete"
3. Confirm deletion

---

## 📧 **5. Newsletter Subscribers**

### **Viewing Subscribers:**

1. Click "Newsletter" tab
2. See all email addresses
3. View subscription dates

### **Exporting List:**

Currently view-only. To export:
1. Open browser console (F12)
2. Type: `localStorage.getItem('tqv_newsletter_subscribers')`
3. Copy the data

---

## 🎨 **6. Editor Features in Detail**

### **Rich Text Formatting:**

#### **Bold Text:**
- Select text → Click **B**
- Or: Ctrl+B (Windows) / Cmd+B (Mac)

#### **Italic Text:**
- Select text → Click *I*
- Or: Ctrl+I (Windows) / Cmd+I (Mac)

#### **Underline:**
- Select text → Click U
- Or: Ctrl+U (Windows) / Cmd+U (Mac)

#### **Highlighting:**
1. Select text
2. Click highlighter icon
3. Choose color:
   - Teal - For key terms
   - Purple - For important notes
   - Yellow - For highlights
   - Green - For success/positive

#### **Headings:**
- **H1:** Main article title
- **H2:** Major sections
- **H3:** Subsections

### **Media Embedding:**

#### **Images:**
**Automatic Compression:**
- Original: 2.5MB → Compressed: 400KB
- Saves 80% storage space!
- No quality loss visible

**Best Practices:**
- Use JPG for photos
- Use PNG for graphics/logos
- Max recommended: 5MB original

#### **Videos:**
**YouTube Only:**
- Paste any YouTube URL
- Auto-converts to embed
- Responsive player

**Tips:**
- Use official YouTube links
- Avoid age-restricted videos
- Test video plays correctly

#### **Documents:**
**Supported Types:**
- PDF - Research papers, guides
- Word - Documents, reports
- TXT - Plain text files

**Display:**
- Shows as download card
- Displays filename and size
- Users can download

### **Resources Panel:**

#### **What Are Resources?**
External links that appear at the bottom of articles.

#### **Types:**
1. **Videos** - YouTube links
   - Auto-fetches thumbnail
   - Shows play button
   - Opens in new tab

2. **Links** - Websites, articles
   - Shows icon
   - Displays URL
   - Opens in new tab

3. **Documents** - Files
   - Shows file icon
   - Download button

#### **Adding Resources:**
1. Click "Resources" button (sidebar)
2. Enter title (e.g., "ISRO Documentary")
3. Enter URL (e.g., "https://youtube.com/...")
4. Click "Add Resource"
5. Repeat for more resources

#### **Auto-Detection:**
- YouTube URLs → Categorized as "Video"
- Other URLs → Categorized as "Link"

#### **Display:**
Resources appear at article bottom as beautiful cards with:
- Thumbnails (for videos)
- Icons (for links)
- Descriptions
- Click to open

---

## 💾 **7. Data Storage**

### **How It Works:**

All data is stored in your browser's **localStorage**:

- **Articles:** `tqv_media_articles`
- **Videos:** `tqv_media_videos`
- **Newsletter:** `tqv_newsletter_subscribers`

### **Storage Limits:**

- **Chrome/Firefox:** ~10MB
- **Safari:** ~5MB
- **Current usage:** Monitored automatically

### **Warnings:**

If storage approaches 4MB, you'll see a warning.

### **Managing Storage:**

**To free space:**
1. Delete old articles
2. Remove unused images
3. Compress images before upload

**Backup:**
1. Open browser console (F12)
2. Copy localStorage data
3. Save to file

---

## 🎯 **8. Best Practices**

### **Writing Articles:**

1. **Use Clear Titles**
   - Descriptive and engaging
   - 50-70 characters ideal

2. **Write Good Excerpts**
   - 150-200 characters
   - Summarize main point
   - Entice readers

3. **Structure Content**
   - Use headings (H2, H3)
   - Break into paragraphs
   - Add lists for clarity

4. **Add Media**
   - Images every 2-3 paragraphs
   - Videos for demonstrations
   - Documents for downloads

5. **Use Highlights**
   - Key terms in teal
   - Important notes in yellow
   - Quotes in purple

6. **Add Resources**
   - Related videos
   - External references
   - Additional reading

### **Managing Videos:**

1. **Good Titles**
   - Clear and descriptive
   - Include topic

2. **Quality Thumbnails**
   - High resolution
   - Relevant to content

3. **Pin Important Videos**
   - Latest launches
   - Key announcements

### **Newsletter:**

1. **Check Regularly**
   - Monitor subscriber growth
   - Export for email campaigns

2. **Engage Subscribers**
   - Send regular updates
   - Share exclusive content

---

## 🔧 **9. Troubleshooting**

### **Problem: Can't login**
**Solution:**
- Check username: `tqv_admin`
- Check password: `rocket2025`
- Clear browser cache
- Try incognito mode

### **Problem: Article not saving**
**Solution:**
- Check storage space
- Reduce image sizes
- Delete old content
- Try again

### **Problem: Image upload fails**
**Solution:**
- Check file size (< 5MB recommended)
- Use JPG or PNG format
- Try compressing manually first

### **Problem: Video not embedding**
**Solution:**
- Use YouTube URLs only
- Check URL format
- Ensure video is public
- Try embed URL format

### **Problem: Storage quota exceeded**
**Solution:**
1. Delete old articles
2. Remove large images
3. Clear unused resources
4. Compress images before upload

---

## 📱 **10. Mobile Access**

### **Dashboard on Mobile:**

The admin dashboard works on mobile, but:

**Recommended:**
- Use desktop for editing
- Mobile for quick checks

**Mobile Tips:**
- Use landscape mode
- Zoom for precision
- Save frequently

---

## 🚀 **11. Quick Reference**

### **Common Tasks:**

| Task | Steps |
|------|-------|
| Create Article | Dashboard → Articles → Create New |
| Edit Article | Dashboard → Articles → Edit |
| Add Video | Dashboard → Videos → Add Video |
| View Subscribers | Dashboard → Newsletter |
| Pin Content | Edit → Check "Pin" → Save |
| Add Resource | Editor → Resources → Add |
| Upload Image | Editor → Image → Select File |
| Embed Video | Editor → Video → Enter URL |

### **Keyboard Shortcuts:**

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl+B / Cmd+B |
| Italic | Ctrl+I / Cmd+I |
| Underline | Ctrl+U / Cmd+U |
| Save | Ctrl+S / Cmd+S |

---

## 🎓 **12. Tips & Tricks**

### **Editor Tips:**

1. **Use Headings**
   - Improves readability
   - Better SEO
   - Clear structure

2. **Compress Images**
   - Automatic compression enabled
   - Still, start with smaller files
   - Use online compressors first

3. **Preview Before Publishing**
   - Save as Draft first
   - Check on actual site
   - Then publish

4. **Use Resources**
   - Add related content
   - Provide references
   - Enhance credibility

### **Content Tips:**

1. **Write for Readers**
   - Clear language
   - Short paragraphs
   - Active voice

2. **Use Media**
   - Images break up text
   - Videos engage viewers
   - Documents provide depth

3. **Update Regularly**
   - Fresh content
   - Current information
   - Active community

---

## 📞 **13. Support**

### **Need Help?**

**Check:**
1. This manual
2. Documentation in `/docs` folder
3. Browser console for errors

**Common Issues:**
- See Troubleshooting section
- Check storage space
- Clear browser cache

---

## ✅ **14. Checklist**

### **Before Publishing Article:**

- [ ] Title is clear and engaging
- [ ] Excerpt summarizes content
- [ ] Content is well-formatted
- [ ] Images are compressed
- [ ] Videos are embedded
- [ ] Links work correctly
- [ ] Resources are added
- [ ] Status set to "Published"
- [ ] Preview looks good
- [ ] Saved successfully

### **Before Adding Video:**

- [ ] Title is descriptive
- [ ] URL is correct YouTube link
- [ ] Thumbnail is high quality
- [ ] Date is accurate
- [ ] Pin if important
- [ ] Saved successfully

---

## 🎉 **You're Ready!**

You now know how to use every feature of the QuantumVeda Admin Dashboard!

**Remember:**
- Save frequently
- Preview before publishing
- Use all editor features
- Add resources
- Monitor storage

**Happy Publishing! 🚀**

---

## 📚 **Additional Documentation**

For more details, check these docs in the `/docs` folder:

- `EDITOR_FEATURES_GUIDE.md` - Detailed editor guide
- `IMAGE_STORAGE_GUIDE.md` - How image storage works
- `PERFORMANCE_GUIDE.md` - Performance optimizations
- `RESOURCES_UPGRADED.md` - Resources feature details

---

**Version:** 1.0
**Last Updated:** December 19, 2024
**QuantumVeda Team** 🚀
