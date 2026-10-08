import { jsPDF } from 'jspdf';

export const exportToPdf = async (title: string, content: string, modelName: string = 'Google Gemini') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const formattedDate = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;

    // Header Banner
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('SuperMind AI Studio', margin, 12);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Multi-LLM Intelligence & Prompt Synthesis', margin, 17);

    // Model & Date Badge (Right Aligned)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`[ ${modelName} ]`, pageWidth - margin, 12, { align: 'right' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(formattedDate, pageWidth - margin, 17, { align: 'right' });

    // Document Title
    let yPos = 32;
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title || 'SuperMind Document Export', margin, yPos);

    yPos += 4;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Process Content Lines
    const lines = content.split('\n');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // Slate 700

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        yPos += 3;
        return;
      }

      // Check if page break is needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const cleanLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1');

      if (trimmed.startsWith('# ')) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12.5);
        doc.setTextColor(15, 23, 42);
        const splitText = doc.splitTextToSize(cleanLine.slice(2), maxLineWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5.5 + 2;
      } else if (trimmed.startsWith('## ')) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.setTextColor(30, 41, 59);
        const splitText = doc.splitTextToSize(cleanLine.slice(3), maxLineWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5 + 2;
      } else if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(79, 70, 229);
        const headingText = trimmed.startsWith('#### ') ? cleanLine.slice(5) : cleanLine.slice(4);
        const splitText = doc.splitTextToSize(headingText, maxLineWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 4.5 + 2;
      } else if (/^[\*\-\+]\s+/.test(trimmed)) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const itemText = `• ${cleanLine.replace(/^[\*\-\+]\s+/, '')}`;
        const splitText = doc.splitTextToSize(itemText, maxLineWidth - 4);
        doc.text(splitText, margin + 3, yPos);
        yPos += splitText.length * 4.2 + 1;
      } else {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(cleanLine, maxLineWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 4.2 + 1.5;
      }
    });

    // Footer on last page
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 282, pageWidth - margin, 282);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('SuperMind AI Orchestrator Platform', margin, 287);
    doc.text('Verified jsPDF Export', pageWidth - margin, 287, { align: 'right' });

    const cleanFilename = (title || 'SuperMind_AI_Export')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();

    doc.save(`${cleanFilename}.pdf`);
  } catch (err) {
    console.error('jsPDF generation error:', err);
  }
};
