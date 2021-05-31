import React from "react";
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
} from "./FooterStyles";
  
const Footer = () => {
  return (
    <Box>
      <h1 style={{ color: "white", 
                   textAlign: "center", 
                   marginTop: "-50px" }}>
        Request your spare parts
      </h1>
      <Container>
        <Row>
          <Column>
          
            <FooterLink href="#">Home</FooterLink>
            
          </Column>
          <Column>
           
            <FooterLink href="#">Requests</FooterLink>
            
          </Column>
          <Column>
           
            <FooterLink href="#">FOR SUPPLIERS</FooterLink>
            
          </Column>
          <Column>
           
          <FooterLink href="#">FAQ</FooterLink>
          
          </Column>
          <Column>
           
          <FooterLink href="#">Contact</FooterLink>
          
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;