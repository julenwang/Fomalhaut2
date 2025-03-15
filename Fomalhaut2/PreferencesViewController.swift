// SPDX-FileCopyrightText: 2020 mtgto <hogerappa@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import Cocoa
import Shared

class PreferencesViewController: NSViewController {
  @IBOutlet weak var pageOrderPopupButton: NSPopUpButton!
  @IBOutlet weak var scrollDirectionPopupButton: NSPopUpButton!

  override func viewDidLoad() {
    super.viewDidLoad()
    // Do view setup here.
    self.pageOrderPopupButton.selectItem(at: Preferences.standard.defaultPageOrder == .rtl ? 0 : 1)
    self.scrollDirectionPopupButton.selectItem(at:  Preferences.standard.isReverseScrollDirection ? 1 : 0)
  }

  @IBAction func selectPageOrder(_ sender: Any) {
    let pageOrder: PageOrder = self.pageOrderPopupButton.indexOfSelectedItem == 0 ? .rtl : .ltr
    Preferences.standard.setDefaultPageOrder(pageOrder)
  }

  @IBAction func selectScrollDirection(_ sender: Any) {
    Preferences.standard.setScrollDirection(self.scrollDirectionPopupButton.indexOfSelectedItem == 1)
  }
}
