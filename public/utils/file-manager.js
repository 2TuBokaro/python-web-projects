// File Manager Utility for Modi Medical
// Handles file operations, directory scanning, and media management

class FileManager {
    constructor() {
        // Use relative path for frontend compatibility
        this.mediaPath = 'assets';
        this.supportedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        this.supportedVideoTypes = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
        this.supportedDocTypes = ['pdf', 'docx', 'xlsx', 'txt', 'doc'];
    }

    // Get file type from filename
    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        if (this.supportedImageTypes.includes(extension)) {
            return 'image';
        } else if (this.supportedVideoTypes.includes(extension)) {
            return 'video';
        } else if (this.supportedDocTypes.includes(extension)) {
            return 'document';
        } else {
            return 'unknown';
        }
    }

    // Check if file is supported
    isFileSupported(filename) {
        const fileType = this.getFileType(filename);
        return fileType !== 'unknown';
    }

    // Create file info object
    createFileInfo(filename, basePath = this.mediaPath) {
        const fileType = this.getFileType(filename);
        const filePath = `${basePath}/${filename}`;
        
        return {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            filename: filename,
            file_path: filePath,
            type: fileType,
            title: this.formatTitle(filename),
            category: this.categorizeFile(filename, fileType),
            size: null, // Would be populated by backend
            uploaded_at: new Date().toISOString()
        };
    }

    // Format filename to title
    formatTitle(filename) {
        return filename
            .replace(/\.[^/.]+$/, '') // Remove extension
            .replace(/[-_]/g, ' ')     // Replace hyphens and underscores with spaces
            .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
    }

    // Categorize file based on name and type
    categorizeFile(filename, fileType) {
        const lowerName = filename.toLowerCase();
        
        if (lowerName.includes('banner') || lowerName.includes('main')) {
            return 'banner';
        } else if (lowerName.includes('logo')) {
            return 'logo';
        } else if (lowerName.includes('promo')) {
            return 'promo';
        } else if (fileType === 'image') {
            return 'image';
        } else if (fileType === 'video') {
            return 'video';
        } else if (fileType === 'document') {
            return 'document';
        } else {
            return 'other';
        }
    }

    // Simulate directory scanning (in real implementation, this would call backend API)
    async scanDirectory() {
        // Simulated file list based on the actual directory structure
        const simulatedFiles = [
            'MMpromoNoVoice.mov',
            'MainYouTubeImage.gif',
            'MainYouTubeImageFinalInJPEG.jpg',
            'BannerVideo.mp4',
            'BannerVideo2.mp4',
            'MManimation1.mp4',
            'Red Green Minimalist Medical Logo.gif',
            'Red Green Minimalist Medical Logo.mp4',
            'MainYouTubeImageFinalInPNG.png',
            'MainYouTubeImageFinalInPNG copy.png',
            'assets/Stickers/MMSelectedFlyer.jpg',
            'assets/Stickers/Big Savings at MODI MEDICAL (Medical Store in Chas, Bokaro)___ Market-leading discounts..jpg'
        ];

        const fileInfos = simulatedFiles
            .filter(file => this.isFileSupported(file))
            .map(file => this.createFileInfo(file));

        return fileInfos;
    }

    // Load marketing materials from directory
    async loadMarketingMaterials() {
        try {
            const fileInfos = await this.scanDirectory();
            
            // Prioritize promotional materials for landing page
            const promoMaterials = [
                {
                    id: 'promo_001',
                    type: 'video',
                    title: 'MMpromoNoVoice',
                    file_path: 'assets/MMpromoNoVoice.mov',
                    description: 'Featured promotional video',
                    category: 'promo',
                    uploaded_at: new Date().toISOString(),
                    is_featured: true
                },
                {
                    id: 'promo_002',
                    type: 'image',
                    title: 'MainYouTubeImage',
                    file_path: 'assets/MainYouTubeImage.gif',
                    description: 'Featured animated promotion',
                    category: 'banner',
                    uploaded_at: new Date().toISOString(),
                    is_featured: true
                }
            ];
            
            // Convert other files to marketing materials format
            const otherMaterials = fileInfos
                .filter(info => !info.filename.includes('MMpromoNoVoice') && !info.filename.includes('MainYouTubeImage'))
                .map(info => ({
                    id: info.id,
                    type: info.type,
                    title: info.title,
                    file_path: info.file_path,
                    description: `${info.category} - ${info.type}`,
                    category: info.category,
                    uploaded_at: info.uploaded_at,
                    is_featured: false
                }));

            return [...promoMaterials, ...otherMaterials];
        } catch (error) {
            console.error('Error loading marketing materials:', error);
            return [];
        }
    }

    // Refresh marketing materials
    async refreshMarketingMaterials() {
        try {
            const materials = await this.loadMarketingMaterials();
            
            // Check if setMarketingMaterials function exists
            if (typeof setMarketingMaterials === 'function') {
                setMarketingMaterials(materials);
            } else {
                console.warn('setMarketingMaterials function not available, using localStorage directly');
                localStorage.setItem('modi_marketing_materials', JSON.stringify(materials));
            }
            
            // Check if updateSettings function exists
            if (typeof updateSettings === 'function') {
                updateSettings({ last_file_refresh: new Date().toISOString() });
            } else {
                console.warn('updateSettings function not available');
            }
            
            console.log('Marketing materials refreshed successfully:', materials.length, 'items');
            return materials;
        } catch (error) {
            console.error('Error in refreshMarketingMaterials:', error);
            throw error;
        }
    }

    // Get featured material
    getFeaturedMaterial(materials) {
        return materials.find(m => 
            m.title.toLowerCase().includes('mainyoutubeimage') || 
            m.category === 'banner'
        ) || materials.find(m => m.type === 'image');
    }

    // Validate uploaded file
    validateUploadedFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const fileType = this.getFileType(file.name);

        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'File size exceeds 10MB limit'
            };
        }

        if (fileType === 'unknown') {
            return {
                valid: false,
                error: 'Unsupported file type. Supported types: images, videos, and documents'
            };
        }

        return { valid: true };
    }

    // Create file URL for serving
    createFileUrl(filename) {
        // In real implementation, this would create proper URL path
        return `/static/modi-media/${filename}`;
    }

    // Download file
    downloadFile(filename) {
        const link = document.createElement('a');
        link.href = this.createFileUrl(filename);
        link.download = filename;
        link.click();
    }

    // Get file statistics
    getFileStatistics(materials) {
        const stats = {
            total: materials.length,
            images: materials.filter(m => m.type === 'image').length,
            videos: materials.filter(m => m.type === 'video').length,
            documents: materials.filter(m => m.type === 'document').length,
            byCategory: {}
        };

        materials.forEach(material => {
            stats.byCategory[material.category] = (stats.byCategory[material.category] || 0) + 1;
        });

        return stats;
    }
}

// Create global instance
const fileManager = new FileManager();