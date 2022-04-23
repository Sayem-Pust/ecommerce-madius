from django.views import generic
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.views import APIView
from rest_framework.response import Response

from product.models import Variant, Product, ProductVariant

class ProductCreateApiView(APIView):

    def post(self, request):
        print(request.data)
        # productName = request.data.get('productName')
        # productSKU = request.data.get('productSKU')
        # description = request.data.get('description')
        product = Product.objects.create(
            title=productName, sku=productSKU, description=description)
        productVariants = request.data.get('productVariants')
        for i in productVariants:
            # print(i)
            varient = Variant.objects.filter(id=i['option']).first()
            print(Variant.objects.filter(id=i['option']))
            for j in i['tags']:
                print(j)
                product_variant = ProductVariant.objects.create(
                    variant_title=j,
                    variant=varient,
                    product=product
                )
                
        # productVariantPrices = request.data.get('productVariantPrices')

        # product = Product.objects.create(
        #     title=productName, sku=productSKU, description=description)
        return Response("created")

        
        

def is_valid_queryparam(param):
    return param != '' and param is not None

class CreateProductView(generic.TemplateView):
    template_name = 'products/create.html'

    def get_context_data(self, **kwargs):
        context = super(CreateProductView, self).get_context_data(**kwargs)
        variants = Variant.objects.filter(active=True).values('id', 'title')
        print(self.request)
        context['product'] = True
        context['variants'] = list(variants.all())
        return context


def ProductList(request):
    products = Product.objects.all()
    # variant = Variant.objects.all().distinct('variantProduct__variant_title')
    # variant = Variant.objects.all().values_list(
    #     'variantProduct__variant_title', flat=True).distinct()
    variant = Variant.objects.all()

    paginator = Paginator(products, 4)
    page = request.GET.get('page', 1)
    paged_listings = paginator.get_page(page)

    context = {
        "products": paged_listings,
        "variant": variant,

    }
    return render(request, "products/list.html", context)



def SearchProduct(request):
    qs = Product.objects.all()
    variant = Variant.objects.all()

    title_contains_query = request.GET.get('title')
    variant_contains_query = request.GET.get('variant')
    price_from = request.GET.get('price_from')
    price_to = request.GET.get('price_to')
    date = request.GET.get('date')

    if is_valid_queryparam(title_contains_query):
        qs = qs.filter(title__icontains=title_contains_query)

    if is_valid_queryparam(variant_contains_query):
        qs = qs.filter(productVariant__variant_title=variant_contains_query)

    if is_valid_queryparam(price_from):
        qs = qs.filter(productVariantPrice__price__gte=price_from)

    if is_valid_queryparam(price_to):
        qs = qs.filter(productVariantPrice__price__lt=price_to)

    if is_valid_queryparam(date):
        qs = qs.filter(created_at=date)


    context = {
        "products": qs.distinct(),
        "variant": variant
    }
    return render(request, "products/list.html", context)


def EditProducts(request, pk):
    return render(request, "products/list.html")

