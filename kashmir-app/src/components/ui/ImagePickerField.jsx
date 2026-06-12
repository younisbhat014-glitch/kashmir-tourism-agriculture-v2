import React, { useState } from 'react';

const MAX_SOURCE_SIZE = 12 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 2.4 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1200;

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Could not read this image.'));
  reader.readAsDataURL(file);
});

const loadImage = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('Could not process this image.'));
  image.src = source;
});

async function compressImage(file) {
  if (!file?.type?.startsWith('image/')) throw new Error('Please select an image file.');
  if (file.size > MAX_SOURCE_SIZE) throw new Error('Image is too large. Please choose one below 12 MB.');

  const source = await readFile(file);
  const image = await loadImage(source);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const compressed = canvas.toDataURL('image/jpeg', 0.76);
  if (compressed.length > MAX_OUTPUT_SIZE) {
    throw new Error('Image is still too large. Please choose a smaller photo.');
  }
  return compressed;
}

export default function ImagePickerField({ value = '', onChange, label = 'Image' }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setProcessing(true);
    setError('');
    try {
      onChange(await compressImage(file));
    } catch (err) {
      setError(err.message || 'Could not use this image.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="image-picker-field">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type="url"
        value={value.startsWith('data:image/') ? '' : value}
        onChange={event => onChange(event.target.value)}
        placeholder="Paste image URL or choose a photo below"
      />

      <div className="image-picker-actions">
        <label className={`image-picker-button${processing ? ' is-disabled' : ''}`}>
          Camera
          <input
            className="image-picker-native-input"
            type="file"
            accept="image/*"
            capture="environment"
            disabled={processing}
            onClick={event => { event.currentTarget.value = ''; }}
            onChange={selectFile}
          />
        </label>
        <label className={`image-picker-button${processing ? ' is-disabled' : ''}`}>
          Gallery
          <input
            className="image-picker-native-input"
            type="file"
            accept="image/*"
            disabled={processing}
            onClick={event => { event.currentTarget.value = ''; }}
            onChange={selectFile}
          />
        </label>
        {value && (
          <button type="button" className="image-picker-button image-picker-remove" onClick={() => onChange('')} disabled={processing}>
            Remove
          </button>
        )}
      </div>

      {processing && <div className="image-picker-note">Preparing image...</div>}
      {error && <div className="image-picker-error">{error}</div>}
      {value && (
        <div className="image-picker-preview">
          <img src={value} alt="Selected preview" />
          <span>{value.startsWith('data:image/') ? 'Selected photo' : 'Image URL preview'}</span>
        </div>
      )}
    </div>
  );
}
