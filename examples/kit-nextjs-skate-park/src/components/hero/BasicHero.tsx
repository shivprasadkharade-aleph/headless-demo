import React, {JSX} from 'react';
import ContentBlock from 'components/content-block/ContentBlock';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  Text,
  RichText,
  Field,
  withDatasourceCheck,
  GetComponentServerProps,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link,
} from '@sitecore-content-sdk/nextjs';
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

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Text field={props.fields.Title} />
        <Text class="subtext" field={props.fields.SubText} />
        {/* <p>{props.fields.Title.value}</p> */}
      </div>
    </div>
  );
};
