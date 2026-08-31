package com.crimescope.ml;

import com.zc.component.ml.ZCAge;
import com.zc.component.ml.ZCAnalyseMode;
import com.zc.component.ml.ZCBarcodeData;
import com.zc.component.ml.ZCBarcodeFormat;
import com.zc.component.ml.ZCBarcodeOptions;
import com.zc.component.ml.ZCContent;
import com.zc.component.ml.ZCFaceAnalysisData;
import com.zc.component.ml.ZCFaceAnalyticsOptions;
import com.zc.component.ml.ZCFaceComparisonData;
import com.zc.component.ml.ZCFaceEmotion;
import com.zc.component.ml.ZCFaceLandmark;
import com.zc.component.ml.ZCFacePoints;
import com.zc.component.ml.ZCFaces;
import com.zc.component.ml.ZCGender;
import com.zc.component.ml.ZCImageModerateData;
import com.zc.component.ml.ZCImageModerationConfidence;
import com.zc.component.ml.ZCImageModerationOptions;
import com.zc.component.ml.ZCImageModerationPrediction;
import com.zc.component.ml.ZCLine;
import com.zc.component.ml.ZCML;
import com.zc.component.ml.ZCObjectDetectionData;
import com.zc.component.ml.ZCObjectPoints;
import com.zc.component.ml.ZCOCROptions;
import com.zc.component.ml.ZCOCRModelType;
import com.zc.component.ml.ZCParagraph;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CrimeScope AI 2.0 - Unified Zoho Catalyst ML Intelligence Service
 * 
 * Integrates six core AI/ML biometric, vision, document, and barcode intelligence APIs:
 * 1. Facial Analytics (Age, Gender, Emotion, Landmarks)
 * 2. Optical Character Recognition - OCR (Multi-lingual text extraction)
 * 3. Face Comparison & Verification (Mugshot & CCTV matching)
 * 4. Image Moderation (Content safety & explicit media screening)
 * 5. Object Detection (Identifying objects, vehicles, items & coordinates)
 * 6. Barcode & QR Code Scanner (Reading 1D/2D barcodes, QR codes, evidence tags)
 */
public class CatalystMLUnifiedService {

    private static final double DEFAULT_MATCH_THRESHOLD = 80.0;

    // =========================================================================
    // 1. FACE ANALYTICS ENGINE
    // =========================================================================
    public ZCFaceAnalysisData analyzeFace(File imageFile) throws Exception {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Image file does not exist.");
        }

        ZCFaceAnalyticsOptions options = ZCFaceAnalyticsOptions.getInstance()
                .setAgeNeeded(true)
                .setEmotionNeeded(true)
                .setGenderNeeded(true)
                .setAnalyseMode(ZCAnalyseMode.ADVANCED);

        return ZCML.getInstance().analyzeFace(imageFile, options);
    }

    // =========================================================================
    // 2. OPTICAL CHARACTER RECOGNITION (OCR) ENGINE
    // =========================================================================
    public ZCContent extractOCRText(File imageFile, String languageCodes) throws Exception {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Document file does not exist.");
        }

        String langs = (languageCodes == null || languageCodes.trim().isEmpty()) ? "eng,tam" : languageCodes;

        ZCOCROptions options = ZCOCROptions.getInstance()
                .setModelType(ZCOCRModelType.OCR)
                .setLanguageCode(langs);

        return ZCML.getInstance().getContent(imageFile, options);
    }

    // =========================================================================
    // 3. FACE COMPARISON & VERIFICATION ENGINE
    // =========================================================================
    public ZCFaceComparisonData compareFaces(File sourceImage, File queryImage) throws Exception {
        if (sourceImage == null || !sourceImage.exists() || queryImage == null || !queryImage.exists()) {
            throw new IllegalArgumentException("Source or query image file is invalid.");
        }

        return ZCML.getInstance().compareFace(sourceImage, queryImage);
    }

    // =========================================================================
    // 4. IMAGE MODERATION ENGINE
    // =========================================================================
    public ZCImageModerateData moderateImage(File imageFile) throws Exception {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Evidence file does not exist.");
        }

        ZCImageModerationOptions options = ZCImageModerationOptions.getInstance()
                .setAnalyseMode(ZCAnalyseMode.ADVANCED);

        return ZCML.getInstance().moderateImage(imageFile, options);
    }

    // =========================================================================
    // 5. OBJECT DETECTION ENGINE
    // =========================================================================
    public List<ZCObjectDetectionData> detectObjects(File imageFile) throws Exception {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Image file does not exist.");
        }

        return ZCML.getInstance().detectObjects(imageFile);
    }

    // =========================================================================
    // 6. BARCODE & QR CODE SCANNER ENGINE
    // =========================================================================
    /**
     * Scans 1D and 2D barcodes, QR codes, and evidence tags from an image file.
     * @param imageFile Input image file containing barcodes or QR codes
     * @return ZCBarcodeData containing barcode content and format
     */
    public ZCBarcodeData scanBarcode(File imageFile) throws Exception {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Barcode image file does not exist.");
        }

        ZCBarcodeOptions options = ZCBarcodeOptions.getInstance()
                .setFormat(ZCBarcodeFormat.ALL);

        return ZCML.getInstance().scanBarcode(imageFile, options);
    }

    // =========================================================================
    // 7. MASTER END-TO-END EVIDENCE DOSSIER PIPELINE
    // =========================================================================
    /**
     * Unified pipeline that processes a raw evidence file through Moderation, 
     * Face Analytics, Object Detection, Barcode/QR Scanning, OCR Text Extraction, 
     * and Suspect Comparison.
     * 
     * @param evidenceImage The evidence photo/document to analyze
     * @param suspectReferenceImage Optional reference mugshot (can be null if comparison not needed)
     * @param ocrLangs Language codes for OCR text extraction (e.g. "eng,tam")
     * @return EvidenceDossierReport DTO containing all combined ML findings
     */
    public EvidenceDossierReport processEvidenceDossier(File evidenceImage, File suspectReferenceImage, String ocrLangs) {
        EvidenceDossierReport report = new EvidenceDossierReport();
        report.fileName = evidenceImage.getName();
        report.timestamp = System.currentTimeMillis();

        // Step 1: Content Moderation
        try {
            ZCImageModerateData modData = moderateImage(evidenceImage);
            report.isSafe = "SAFE".equalsIgnoreCase(String.valueOf(modData.getPrediction()));
            report.moderationCategory = String.valueOf(modData.getPrediction());
            report.moderationConfidence = modData.getConfidence();

            if (modData.getImageModerationConfidenceList() != null) {
                for (ZCImageModerationConfidence mc : modData.getImageModerationConfidenceList()) {
                    report.moderationDetails.put(mc.getCategory(), mc.getConfidence());
                }
            }
        } catch (Exception e) {
            report.errors.add("Moderation Error: " + e.getMessage());
        }

        // Abort further processing if content is unsafe
        if (!report.isSafe) {
            report.statusSummary = "BLOCKED: Evidence image flagged as inappropriate or unsafe (" + report.moderationCategory + ").";
            return report;
        }

        // Step 2: Facial Attribute Analytics
        try {
            ZCFaceAnalysisData faceData = analyzeFace(evidenceImage);
            report.facesDetected = faceData.getFacesCount();
            
            if (faceData.getFacesList() != null) {
                for (ZCFaces face : faceData.getFacesList()) {
                    FaceDetail detail = new FaceDetail();
                    detail.confidence = face.getConfidence();
                    if (face.getAge() != null) detail.estimatedAge = face.getAge().getAge();
                    if (face.getGender() != null) detail.detectedGender = face.getGender().getGender();
                    if (face.getEmotion() != null) detail.dominantEmotion = face.getEmotion().getEmotion();
                    if (face.getCoordinates() != null) detail.coordinates = face.getCoordinates().toString();
                    if (face.getFaceLandmarks() != null) detail.landmarkCount = face.getFaceLandmarks().size();
                    report.analyzedFaces.add(detail);
                }
            }
        } catch (Exception e) {
            report.errors.add("Face Analytics Warning: " + e.getMessage());
        }

        // Step 3: Computer Vision Object Detection
        try {
            List<ZCObjectDetectionData> detectedObjs = detectObjects(evidenceImage);
            if (detectedObjs != null) {
                for (ZCObjectDetectionData obj : detectedObjs) {
                    DetectedObjectDetail od = new DetectedObjectDetail();
                    od.objectType = obj.getObjectType();
                    od.confidence = obj.getConfidence();
                    if (obj.getObjectPoints() != null) {
                        od.coordinates = obj.getObjectPoints().toString();
                    }
                    report.detectedObjects.add(od);
                }
            }
        } catch (Exception e) {
            report.errors.add("Object Detection Warning: " + e.getMessage());
        }

        // Step 4: Barcode & QR Code Scanning
        try {
            ZCBarcodeData bcData = scanBarcode(evidenceImage);
            if (bcData != null && bcData.getContent() != null && !bcData.getContent().isEmpty()) {
                report.scannedBarcodeContent = bcData.getContent();
                report.hasBarcode = true;
            }
        } catch (Exception e) {
            report.errors.add("Barcode Scan Warning: " + e.getMessage());
        }

        // Step 5: Multi-Lingual OCR Text Extraction
        try {
            ZCContent ocrContent = extractOCRText(evidenceImage, ocrLangs);
            report.extractedFullText = ocrContent.text;

            if (ocrContent.getParagraphs() != null) {
                for (ZCParagraph p : ocrContent.getParagraphs()) {
                    if (p.lines != null) {
                        for (ZCLine l : p.lines) {
                            report.extractedLines.add(l.text);
                        }
                    }
                }
            }
        } catch (Exception e) {
            report.errors.add("OCR Warning: " + e.getMessage());
        }

        // Step 6: Suspect Face Comparison (If reference image provided)
        if (suspectReferenceImage != null && suspectReferenceImage.exists() && report.facesDetected > 0) {
            try {
                ZCFaceComparisonData cmpData = compareFaces(suspectReferenceImage, evidenceImage);
                report.comparisonMatchScore = cmpData.getMatched();
                report.comparisonConfidence = cmpData.getConfidence();
                report.isSuspectMatch = cmpData.getMatched() >= DEFAULT_MATCH_THRESHOLD;
            } catch (Exception e) {
                report.errors.add("Face Comparison Error: " + e.getMessage());
            }
        }

        report.statusSummary = "SUCCESS: Evidence dossier processed. " 
                             + report.facesDetected + " faces, " 
                             + report.detectedObjects.size() + " objects, "
                             + (report.hasBarcode ? "1 barcode/QR (" + report.scannedBarcodeContent + "), " : "0 barcodes, ")
                             + report.extractedLines.size() + " text lines analyzed.";
        return report;
    }

    // =========================================================================
    // DATA TRANSFER OBJECTS (DTOs)
    // =========================================================================
    public static class EvidenceDossierReport {
        public String fileName;
        public long timestamp;
        public boolean isSafe = true;
        public String moderationCategory = "SAFE";
        public double moderationConfidence = 1.0;
        public Map<String, Double> moderationDetails = new HashMap<>();

        public long facesDetected = 0;
        public List<FaceDetail> analyzedFaces = new ArrayList<>();

        public List<DetectedObjectDetail> detectedObjects = new ArrayList<>();

        public boolean hasBarcode = false;
        public String scannedBarcodeContent = "";

        public String extractedFullText = "";
        public List<String> extractedLines = new ArrayList<>();

        public boolean isSuspectMatch = false;
        public double comparisonMatchScore = 0.0;
        public double comparisonConfidence = 0.0;

        public String statusSummary = "";
        public List<String> errors = new ArrayList<>();
    }

    public static class FaceDetail {
        public double confidence;
        public String estimatedAge;
        public String detectedGender;
        public String dominantEmotion;
        public String coordinates;
        public int landmarkCount;
    }

    public static class DetectedObjectDetail {
        public String objectType;
        public double confidence;
        public String coordinates;
    }
}
