import React , {JSX} from 'react';
import {
  Text,
  RichText,
  Field,
  withDatasourceCheck,
  ComponentParams,
  ComponentRendering,
  GetComponentServerProps,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link,
} from '@sitecore-content-sdk/nextjs';
import ContentBlock from 'components/content-block/ContentBlock';

interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}
type ContentBlockProps = BasicHeroProps & {
  fields: {
    Title: Field<string>;
    SubText: Field<string>;
    Image: ImageField
    CTALink: LinkField
  };
};

export const Default = (props: ContentBlockProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  console.log('Rendering BasicHero:', props.fields);

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Text field={props.fields.Title} />
        <ContentSdkImage field={props.fields.Image} alt="Hero Image" />
        
      </div>
    </div>
  );
};
