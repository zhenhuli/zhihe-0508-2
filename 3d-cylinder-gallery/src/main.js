import './style.css'
import { CylinderGallery } from './modules/CylinderGallery'
import { Interaction } from './modules/Interaction'

const container = document.getElementById('canvas-container')
const gallery = new CylinderGallery(container)

const elements = {
  addImageInput: document.getElementById('add-image'),
  deleteButton: document.getElementById('delete-image'),
  previewModal: document.getElementById('preview-modal'),
  previewImage: document.getElementById('preview-image'),
  closePreview: document.getElementById('close-preview'),
}

new Interaction(gallery, elements)

const sampleImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
  'https://picsum.photos/400/300?random=6',
]

sampleImages.forEach((url) => gallery.addImage(url))
