declare const SH_CKE: any;

const CKEConfig = () => ({
  presets: {
    myCustomPreset: {
      field: {
        key: "myCustomPreset",
        value: "myCustomPreset",
        metadatas: {
          intlLabel: {
            id: "ckeditor5.preset.myCustomPreset.label",
            defaultMessage: "My custom preset",
          },
        },
      },
      editorConfig: {
        plugins: [
          SH_CKE.Alignment,
          SH_CKE.Autoformat,
          SH_CKE.BalloonToolbar,
          SH_CKE.BlockQuote,
          SH_CKE.Bold,
          SH_CKE.Italic,
          SH_CKE.Underline,
          SH_CKE.Strikethrough,
          SH_CKE.Code,
          SH_CKE.CodeBlock,
          SH_CKE.Essentials,
          SH_CKE.Heading,
          SH_CKE.Image,
          SH_CKE.ImageCaption,
          SH_CKE.ImageStyle,
          SH_CKE.ImageToolbar,
          SH_CKE.ImageUpload,
          SH_CKE.Indent,
          SH_CKE.Link,
          SH_CKE.List,
          SH_CKE.Paragraph,
          SH_CKE.PasteFromOffice,
          SH_CKE.RemoveFormat,
          SH_CKE.StrapiMediaLib,
          SH_CKE.StrapiUploadAdapter,
          SH_CKE.MediaEmbed,
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "alignment",
          "blockQuote",
          "code",
          "codeBlock",
          "link",
          "removeFormat",
          "|",
          "bulletedList",
          "numberedList",

          "|",
          "strapiMediaLib",
          "mediaEmbed",
        ],
        balloonToolbar: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "link",
          "|",
          "bulletedList",
          "numberedList",
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
            },
          ],
        },
        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
          ],
        },
      },
    },
  },
});
