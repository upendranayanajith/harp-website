/* ── HARP Reference List ── */
(function () {
  const refs = [
    { n:1,  url:'https://doi.org/10.1016/j.psep.2022.09.069',
      text:'P. Chen, X. Liu, and R. Zhao, "False alarm analysis in computer vision-based industrial gauge monitoring," Process Safety Environ. Prot., vol. 168, pp. 412–425, Dec. 2022.' },
    { n:2,  url:'https://doi.org/10.1145/361237.361242',
      text:'R. O. Duda and P. E. Hart, "Use of the Hough transformation to detect lines and curves in pictures," Commun. ACM, vol. 15, no. 1, pp. 11–15, Jan. 1972.' },
    { n:3,  url:'https://doi.org/10.1016/j.eswa.2020.113270',
      text:'Z. Zhao, J. Zhang, and H. Liu, "Automatic reading of analog meters using deep CNNs with attention," Expert Syst. Appl., vol. 152, p. 113270, Aug. 2020.' },
    { n:4,  url:'https://doi.org/10.1016/j.measurement.2021.110357',
      text:'Y. Gao, H. Feng, and J. Yang, "Automatic reading of pointer-type meters: a comparative study," Measurement, vol. 187, p. 110357, Jan. 2022.' },
    { n:5,  url:'https://doi.org/10.1016/j.measurement.2021.110547',
      text:'Z. Zou et al., "A robust reading method for pointer gauges based on improved U-Net," Measurement, vol. 188, p. 110547, Feb. 2022.' },
    { n:6,  url:'https://doi.org/10.1109/TIM.2021.3084973',
      text:'J. Xiao, Y. Zhao, and B. Zhang, "Image-based industrial meter reading using transformer feature extraction," IEEE Trans. Instrum. Meas., vol. 70, pp. 1–10, 2021.' },
    { n:7,  url:'https://doi.org/10.3390/s23042183',
      text:'L. Yang, T. Wang, and Q. Li, "Digital conversion of analog instrument readings via knowledge distillation," Sensors, vol. 23, no. 4, p. 2183, 2023.' },
    { n:8,  url:'https://doi.org/10.1109/ICIT45562.2020.9067114',
      text:'W. Hu, X. Chen, and Y. Liu, "GAN-augmented training for robust analog gauge reading under extreme illumination," in Proc. IEEE ICIT, pp. 741–746, 2020.' },
    { n:9,  url:'https://proceedings.mlr.press/v139/radford21a.html',
      text:'A. Radford et al., "Learning transferable visual models from natural language supervision," in Proc. ICML, pp. 8748–8763, 2021.' },
    { n:10, url:'https://openaccess.thecvf.com/content/CVPR2023/html/Jeong_WinCLIP_Zero-Few-Shot_Anomaly_Classification_and_Segmentation_CVPR_2023_paper.html',
      text:'J. Jeong et al., "WinCLIP: Zero-/few-shot anomaly classification and segmentation," in Proc. CVPR, pp. 19606–19616, 2023.' },
    { n:11, url:'https://openaccess.thecvf.com/content/CVPR2022/html/Li_Grounded_Language-Image_Pre-Training_CVPR_2022_paper.html',
      text:'L. Li et al., "Grounded language-image pre-training," in Proc. CVPR, pp. 10965–10975, 2022.' },
    { n:12, url:'https://proceedings.mlr.press/v139/jia21b.html',
      text:'C. Jia et al., "Scaling up visual and vision-language representation learning with noisy text supervision," in Proc. ICML, pp. 4904–4916, 2021.' },
    { n:13, url:'https://www.wiley.com/en-us/Directional+Statistics-p-9780471953333',
      text:'K. V. Mardia and P. E. Jupp, Directional Statistics, 2nd ed. Chichester: Wiley, 2000.' },
    { n:14, url:'https://openaccess.thecvf.com/content_CVPR_2019/html/Zhou_Bottom-Up_Object_Detection_by_Grouping_Extreme_and_Center_Points_CVPR_2019_paper.html',
      text:'X. Zhou, X. Zhuo, and P. Krahenbuhl, "Bottom-up object detection by grouping extreme and center points," in Proc. CVPR, pp. 850–859, 2019.' },
    { n:15, url:'https://proceedings.mlr.press/v48/gal16.html',
      text:'Y. Gal and Z. Ghahramani, "Dropout as a Bayesian approximation," in Proc. ICML, pp. 1050–1059, 2016.' },
    { n:16, url:'https://openaccess.thecvf.com/content/CVPR2022W/ABAW/html/Zhang_Uncertainty-Aware_Head_Pose_Estimation_with_MC-Dropout_CVPRW_2022_paper.html',
      text:'Y. Zhang, P. Sun, and Y. Jiang, "Uncertainty-aware head pose estimation with MC-Dropout," in Proc. CVPRW, 2022.' },
    { n:17, url:'https://proceedings.neurips.cc/paper/2017/hash/9ef2ed4b7fd2c810847ffa5fa85bce38-Abstract.html',
      text:'B. Lakshminarayanan, A. Pritzel, and C. Blundell, "Simple and scalable predictive uncertainty estimation using deep ensembles," in Proc. NeurIPS, pp. 6402–6413, 2017.' },
    { n:18, url:'https://arxiv.org/abs/1804.02767',
      text:'J. Redmon and A. Farhadi, "YOLOv3: An incremental improvement," arXiv preprint arXiv:1804.02767, 2018.' },
    { n:19, url:'https://github.com/ultralytics/ultralytics',
      text:'G. Jocher, A. Chaurasia, and J. Qiu, "Ultralytics YOLOv8," 2023. [Online].' },
    { n:20, url:'https://openaccess.thecvf.com/content/CVPR2022W/ECV/html/Maji_YOLO-Pose_Enhancing_YOLO_for_Multi_Person_Pose_Estimation_Using_Object_CVPRW_2022_paper.html',
      text:'D. Maji et al., "YOLO-Pose: Enhancing YOLO for multi-person pose estimation," in Proc. CVPRW, pp. 2637–2646, 2022.' },
    { n:21, url:'https://openaccess.thecvf.com/content_cvpr_2017/html/Cao_Realtime_Multi-Person_2D_CVPR_2017_paper.html',
      text:'Z. Cao, T. Simon, S.-E. Wei, and Y. Sheikh, "Realtime multi-person 2D pose estimation using part affinity fields," in Proc. CVPR, pp. 7291–7299, 2017.' },
    { n:22, url:'https://link.springer.com/chapter/10.1007/978-3-319-46484-8_29',
      text:'A. Newell, K. Yang, and J. Deng, "Stacked hourglass networks for human pose estimation," in Proc. ECCV, pp. 483–499, 2016.' },
    { n:23, url:'https://openaccess.thecvf.com/content_cvpr_2015/html/Long_Fully_Convolutional_Networks_2015_CVPR_paper.html',
      text:'J. Long, E. Shelhamer, and T. Darrell, "Fully convolutional networks for semantic segmentation," in Proc. CVPR, pp. 3431–3440, 2015.' },
    { n:24, url:'https://ieeexplore.ieee.org/document/903548',
      text:'J. L. Pech-Pacheco et al., "Diatom autofocusing in brightfield microscopy," in Proc. ICPR, vol. 3, pp. 314–317, 2000.' },
    { n:25, url:'https://www.cambridge.org/core/books/multiple-view-geometry-in-computer-vision/0B6F289C78B2B23F596CAA76D3D43F7A',
      text:'R. Hartley and A. Zisserman, Multiple View Geometry in Computer Vision, 2nd ed. Cambridge: CUP, 2004.' },
    { n:26, url:'https://www.ams.org/books/conm/453/',
      text:'H. Edelsbrunner and J. Harer, "Persistent homology—a survey," in Surveys Discrete Comput. Geom., AMS, 2008, pp. 257–282.' },
    { n:27, url:'https://openaccess.thecvf.com/content_cvpr_2016/html/He_Deep_Residual_Learning_CVPR_2016_paper.html',
      text:'K. He, X. Zhang, S. Ren, and J. Sun, "Deep residual learning for image recognition," in Proc. CVPR, pp. 770–778, 2016.' },
    { n:28, url:'https://openreview.net/forum?id=YicbFdNTTy',
      text:'A. Dosovitskiy et al., "An image is worth 16x16 words: Transformers for image recognition at scale," in Proc. ICLR, 2021.' },
    { n:29, url:'https://link.springer.com/chapter/10.1007/978-3-319-24574-4_28',
      text:'O. Ronneberger, P. Fischer, and T. Brox, "U-Net: Convolutional networks for biomedical image segmentation," in Proc. MICCAI, pp. 234–241, 2015.' },
    { n:30, url:'https://proceedings.neurips.cc/paper/2017/hash/2650d6089a6d640c5e85b2b88265dc2b-Abstract.html',
      text:'A. Kendall and Y. Gal, "What uncertainties do we need in Bayesian deep learning for computer vision?" in Proc. NeurIPS, pp. 5574–5584, 2017.' }
  ];

  function renderRefs() {
    const ul = document.getElementById('ref-list');
    if (!ul) return;
    ul.innerHTML = refs.map(r => `
      <li style="display:flex;gap:12px;">
        <span style="color:var(--cyan);min-width:28px;font-weight:600;">[${r.n}]</span>
        <div>${r.text}
          <a href="${r.url}" target="_blank" rel="noopener noreferrer"
             style="color:var(--cyan);text-decoration:none;margin-left:6px;white-space:nowrap;">↗ Article</a>
        </div>
      </li>`).join('');
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderRefs);
  } else {
    renderRefs();
  }
  /* Also re-render when the Survey tab is opened */
  document.addEventListener('click', function(e) {
    if (e.target.matches('.tab-btn[data-tab="survey"]')) {
      setTimeout(renderRefs, 50);
    }
  });
})();
