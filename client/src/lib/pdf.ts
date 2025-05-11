import { jsPDF } from 'jspdf';
import type { Resume } from '../types/resume';
import html2canvas from 'html2canvas';

// Function to generate PDF from resume data
export const generatePDF = async (
  resumeData: Resume, 
  previewRef: React.RefObject<HTMLDivElement>
): Promise<Blob> => {
  try {
    if (!previewRef.current) {
      throw new Error('Preview container not found');
    }
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Convert the resume preview HTML to an image using html2canvas
    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading cross-origin images
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Calculate the proper scaling to fit the image on the PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    // Add the image to the PDF
    doc.addImage(
      imgData, 
      'PNG', 
      0, 
      0, 
      imgWidth * ratio, 
      imgHeight * ratio
    );
    
    // Return the PDF as a Blob
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Function to download the PDF
export const downloadPDF = async (
  resume: Resume, 
  previewRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  try {
    // Generate the PDF blob
    const pdfBlob = await generatePDF(resume, previewRef);
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.personalDetails.name ? resume.personalDetails.name.replace(/\s+/g, '_') : 'Resume'}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF. Please try again.');
  }
};
