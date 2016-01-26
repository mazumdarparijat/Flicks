//
//  MovieCell.swift
//  Flicks
//
//  Created by Parijat Mazumdar on 25/01/16.
//  Copyright © 2016 Parijat Mazumdar. All rights reserved.
//

import UIKit

class MovieCell: UITableViewCell {

    @IBOutlet weak var title: UILabel!
    @IBOutlet weak var overviewLabel: UILabel!
    @IBOutlet weak var posterView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
