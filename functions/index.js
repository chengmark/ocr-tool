const functions = require('firebase-functions');
const { Firestore } = require('@google-cloud/firestore');
const vision = require('@google-cloud/vision');
const firestore = new Firestore();

exports.detectText = functions
  .region('asia-east2')
  .storage.object()
  .onFinalize(async (object) => {
    const bucket = object.bucket;
    const filename = object.name;
    const image_uri = `gs://${bucket}/${filename}`;

    // if (image_uri.includes('.pdf')) detectFromPdf(image_uri);
    // else detectFromImage(image_uri);

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(image_uri);
    const detections = result.fullTextAnnotation;

    let textParagraphs = [];
    detections.pages.forEach((page) => {
      page.blocks.forEach((block) => {
        block.paragraphs.forEach((paragraph) => {
          let paragraphText = '';
          paragraph.words.forEach((word) => {
            word.symbols.forEach((symbol) => {
              paragraphText += symbol.text;
            });
          });
          paragraphText.replaceAll('\n', '');
          textParagraphs.push(paragraphText);
        });
      });
    });
    const content = textParagraphs.join('\\n');

    // console.log('Text: ');
    // detections.text = detections.text.replaceAll('\n', '\\n');
    // console.log(detections);

    const document = firestore.doc(`documents/${new Date().getTime()}`);
    await document.set({
      image_uri,
      // content: detections.text,
      content,
      name: filename,
    });
  });
