// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Foundation
import Shared

struct Preferences {
  static var standard = Preferences()
  var defaultPageOrder: PageOrder
  var isReverseScrollDirection: Bool

  init() {
    let userDefaults = UserDefaults.standard
    self.defaultPageOrder = PageOrder.defaultPageOrder(userDefaults)
    self.isReverseScrollDirection = userDefaults.bool(forKey: ScrollDirection.userDefaultsKey)
  }

  mutating func setDefaultPageOrder(_ pageOrder: PageOrder) {
    let userDefaults = UserDefaults.standard
    self.defaultPageOrder = pageOrder
    userDefaults.setValue(pageOrder.rawValue, forKey: PageOrder.userDefaultsKey)
  }

  mutating func setScrollDirection(_ isReverseScrollDirection: Bool) {
    let userDefaults = UserDefaults.standard
    self.isReverseScrollDirection = isReverseScrollDirection
    userDefaults.setValue(isReverseScrollDirection, forKey: ScrollDirection.userDefaultsKey)
  }
}
