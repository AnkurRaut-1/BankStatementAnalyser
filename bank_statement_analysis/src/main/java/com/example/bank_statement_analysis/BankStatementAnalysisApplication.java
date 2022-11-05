package com.example.bank_statement_analysis;

import com.example.bank_statement_analysis.service.BSA_PDF_Service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BankStatementAnalysisApplication {
    private Logger logger = LoggerFactory.getLogger(BSA_PDF_Service.class);

    //Applying license key of Spire.PDF commercial library
    public BankStatementAnalysisApplication() {
        try {
            com.spire.license.LicenseProvider.setLicenseKey("AAEAVHcwx3+5nAq3dHA2OPBip1My7XmMxC7r7Vtaap34e4nEH4kfbv4pB7ts06XLsDnRDAHmIDwpoayqitf8cZK9OeIqo5KWPx+D6OnTRceL7XtxPaxCC1Wn9zOsRyBCyUBzQ09oVqJPFmh3Il0VAhq18GU/eabYOQ+n9UHO1/yNSQFgaazZIHREO56v+8rq3TZtr6yLs51PQfdODo6roh9NgRAEzZla5G6BW99/8mWfovLz3ZZnNFuxS0ckxJ2un0XasSR58QFNangQd4QcY7GQemW0r+kvcxz6xM5OEWLaPLHas/Psqzku3cuSGYXIl8tpOQRDK/IARVRxhDgGYDmLzgJhY5idnNbWlhTuoQi2cCQKB+Bfo+VeTeOm/khSG033gROSyMTv/9Ad4RRkqX8sdNqVOVlZaG+slOJjchnz4Lo8xU0Aq495ksaVkecyTaP887Sim1nRLQDUIJMWB7+VNKTdKwGe6laLlV2AAfGFFDNiWqhGTchTsfmBqx9ab/mInkfKmwpLjQJaPP88KgU7shZ+vyQFZQRzi+FlfUZcoHEQW/o7odDg8AKD5DqPugDu6l2bAkjky3DSMyw46GuQUryojI6h9BGDAClBYrPTsBwI8JuMtq498f5her2ndvrCkABxy1jgQO2y8vewzDv+f+Vm1W7uVqSCTlGuK1zi7zgrLvYvi4tGye1fohxFVJaatRpZ/h0Uu1krcDeV4NgHepSh03cg3brVBbOaOYR9PR3Udmq/R2RIe8ensDUtDFp8IzLYjWEroLKA0ZK+DAnjDzpFzZIAybxFgIZpIk4Ireh7r4RR64wpplZTyxsgm7fMzt/0r/pBmX/DLjucASR8BeOPLhHthsRNwhfcbjphheSHNL6tc5Dn2QeHJHX+lCsUIVBpkuIXrwT/SN1as+mUZnrfcG8HdouOpjJAfi6cNiTJ2W+RRKVe8Fw+IGneK4W6/6rLXCDyE1XqFn5EnsxgvbBIKZEspCsjo8NtJD83w66FZkZOjAbwnhT2QpQ7UaL+fs6p7MJwcY6ZXvw/j0JYp/FxG7ITvixLu14H/5wgsxaCUQK8hLPlKmExKWeBXwDp4m/xK5cmQguyw6LFSB3vNIrBG1/n9PlmbUtOdps1ic0RGijC9mMZSvnuNPn/tCwS9iviTc+n0uH5IW330YiYnEhpny3mRfN39si/LXzRHGWZgjyhWPr8OghTQhUY1+x7NOd5x2k3VhV3J2k1a9NqYHUk9rLL8WCY0ZgZrX2RugOXqMyrJIwaAQVNRt0i2Y+jXOB+tSZUO0dREyRdK5S00sU7gQ/Qqgmprc00GvSlArSc9uRBiPb4dbYj6RwNlWeidPyaqZqbjKR0sAq5R5BzV/O3uPU1XTf+0+ZGW4sbKMVIsVsdfO0FOe7LEvm1oY6OB/v06PMfQT8bGpVaqcRtuxj5OnfL");
            logger.info("License Key Applied");
        } catch (Exception e) {
            logger.error("Error in License Key");
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(BankStatementAnalysisApplication.class, args);
    }
}



