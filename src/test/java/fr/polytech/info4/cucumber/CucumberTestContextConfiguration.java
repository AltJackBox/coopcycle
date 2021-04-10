package fr.polytech.info4.cucumber;

import fr.polytech.info4.MyblogApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = MyblogApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
