import React, { JSX } from 'react';
import {TextField, ComponentParams, ComponentRendering, NextImage as ContentSdkImage, Link as ContentSdkLink, Text, ImageField, LinkField, } from '@sitecore-content-sdk/nextjs';

interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: BasicHeroProps): JSX.Element => {
  console.log('Rendering BasicHero with props:', props);

  const fields = props.rendering?.fields ?? {};

  const id = props.params.RenderingIdentifier;
  const imagePath = fields.Image;
  const TitleText = fields.Title;
  const SubTitlText = fields.SubText;
  const CTALinkText = fields.Link;


  return (
    <div className="container-wrapper"><div className="component container-default col-12 container">
    <section className="hero">
    <div className="hero__media">
      <ContentSdkImage className="hero__img" field={imagePath as ImageField} />
      <div className="hero__overlay"></div>
    </div>

    <div className="hero__content">
        <Text tag='h1' className ="hero__title hero__padding" field={TitleText as TextField}></Text>
        {/* <h1 className="hero__title hero__padding">{TitleText}</h1> */}

        <p className="hero__subtitle">
          <Text field={SubTitlText as TextField}></Text>
        </p>

        <div className="hero__cta">
            <ContentSdkLink className="btn" field={CTALinkText as LinkField} />
        </div>
    </div>
</section>
</div>
</div>
  );
};
