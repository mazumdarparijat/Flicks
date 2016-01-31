//
//  MoviesViewController.swift
//  Flicks
//
//  Created by Parijat Mazumdar on 24/01/16.
//  Copyright © 2016 Parijat Mazumdar. All rights reserved.
//

import UIKit
import AFNetworking
import MBProgressHUD
class MoviesViewController: UIViewController, UICollectionViewDataSource {

    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var networkErrorLabel: UILabel!
    var movies: [NSDictionary]?
    override func viewDidLoad() {
        super.viewDidLoad()

        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: "RefreshControlAction:", forControlEvents: .ValueChanged)
        
        self.networkErrorLabel.hidden = true
        
        collectionView.dataSource = self
        collectionView.addSubview(refreshControl)
        RefreshControlAction(nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if let movies = movies {
            return movies.count
        } else {
            return 0
        }
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("posterCell",forIndexPath: indexPath) as! MovieViewCell
        let movie = movies![indexPath.row]
        let posterPath = movie["poster_path"] as! String
        let baseURL = "https://image.tmdb.org/t/p/w342"
        let imageURL = NSURL(string: baseURL + posterPath)
        cell.posterView.setImageWithURL(imageURL!)
        return cell
    }
    
    func RefreshControlAction(refreshControl:UIRefreshControl?) {
        let apiKey = "a07e22bc18f5cb106bfe4cc1f83ad8ed"
        let url = NSURL(string: "https://api.themoviedb.org/3/movie/now_playing?api_key=\(apiKey)")
        
        let request = NSURLRequest(
            URL: url!,
            cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData,
            timeoutInterval: 10)
        
        let session = NSURLSession(
            configuration: NSURLSessionConfiguration.defaultSessionConfiguration(),
            delegate: nil,
            delegateQueue: NSOperationQueue.mainQueue())
        if (refreshControl == nil) {
            MBProgressHUD.showHUDAddedTo(self.view, animated: true)
        }
        
        let task: NSURLSessionDataTask = session.dataTaskWithRequest(request,
            completionHandler: { (dataOrNil, response, error) in
                
                if let refreshControl = refreshControl {
                    refreshControl.endRefreshing()
                } else {
                    MBProgressHUD.hideHUDForView(self.view, animated: true)
                }
                
                
                
                if let data = dataOrNil {
                    self.networkErrorLabel.hidden = true
                    if let responseDictionary = try! NSJSONSerialization.JSONObjectWithData(
                        data, options:[]) as? NSDictionary {
                            print("response: \(responseDictionary)")
                            self.movies = responseDictionary["results"] as! [NSDictionary]
                            self.collectionView.reloadData()
                    }
                } else {
                    self.networkErrorLabel.hidden = false
                }
        })
        task.resume()
    }
    
    @IBAction func onTapCallback(sender: UITapGestureRecognizer) {
        RefreshControlAction(nil)
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
