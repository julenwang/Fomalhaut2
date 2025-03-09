// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Foundation

struct ArchiverImage {
  static var supportedExtensions: [String] {
    let extensions = ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "webp"]
    if #available(macOS 15, *) {
      return extensions + ["avif", "jxl"]
    }
    if #available(macOS 13, *) {
      return extensions + ["avif"]
    }
    return extensions
  }
}
