// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Cocoa

extension NSImage {
  func resizedImageFixedAspectRatio(maxPixelsWide: Int, maxPixelsHigh: Int) -> Data? {
    let maxWidth = CGFloat(maxPixelsWide)
    let maxHeight = CGFloat(maxPixelsHigh)
    let width: CGFloat
    let height: CGFloat
    let aspectRatio = self.size.height / self.size.width
    if self.size.height / self.size.width > maxHeight / maxWidth {
      width = maxHeight / aspectRatio
      height = maxHeight
    } else {
      width = maxWidth
      height = maxWidth * aspectRatio
    }
    return self.resizedImage(pixelsWide: Int(width), pixelsHigh: Int(height))
  }

  func resizedImage(pixelsWide: Int, pixelsHigh: Int) -> Data? {
    guard
      let newBitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: pixelsWide,
        pixelsHigh: pixelsHigh,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .calibratedRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0)
    else {
      log.error("Failed to retrieve bitmap from image")
      return nil
    }
    newBitmap.size = NSSize(width: pixelsWide, height: pixelsHigh)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: newBitmap)
    self.draw(
      in: NSRect(origin: .zero, size: newBitmap.size), from: .zero, operation: .copy, fraction: 1.0)
    NSGraphicsContext.restoreGraphicsState()

    return newBitmap.representation(using: .jpeg, properties: [:])
  }

  func monochrome() -> NSImage? {
    guard let tiffRepresentation = self.tiffRepresentation else { return nil }
    guard let ciImage = CIImage(data: tiffRepresentation) else { return nil }
    guard let filter = CIFilter(name: "CIPhotoEffectNoir") else { return nil }
    filter.setValue(ciImage, forKey: kCIInputImageKey)
    guard let outputCIImage = filter.outputImage else { return nil }
    let rep = NSCIImageRep(ciImage: outputCIImage)
    let newImage = NSImage(size: rep.size)
    newImage.addRepresentation(rep)

    return newImage
  }
}
